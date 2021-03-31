import json
import sys

if (len(sys.argv) == 1 or sys.argv[1] == "-h" or sys.argv[1] == "--help"):
  s = """Usage: validate.py FILE [-v]
Detta program validerar ett recept.

Den kollar så att:
- Alla ingredienser som nämns finns i listan av ingredienser
- Alla resurser som nämns finns i listan av resurser
- Alla ingredienser och resurser högst upp i filen nämns i någon task
- Varje task "leder" till en final task. (Alltså att det inte kan finnas
  andra tasks kvar när alla finaltasks är klara. Det kan finnas flera final
  tasks.)

Om "-v" läggs till som argument skriver programmet ut information om vilken
tid som tasks tar och hur många ingredienser som används."""
  print(s)
  sys.exit(0)

with open(sys.argv[1], encoding="utf-8") as f:
  data = json.load(f)

ingredient_map = {}
ingredient_units = {}
for ii in data["ingredients"]:
  ingredient_units[ii["id"]] = ii["unit"]
  ingredient_map[ii["id"]] = 0

resource_map = {}
for ii in data["resources"]:
  resource_map[ii["id"]] = False

ingredients = data["ingredients"]
resources = data["resources"]


final_tasks = []
task_map = set()
with_time = []
for ta in data["tasks"]:
  for res in ta["resources"]:
    res_id = res["resourceId"]
    if not res_id in resource_map:
      print("did not find", res_id, "when checking", ta["id"])

    resource_map[res_id] = True
  for ing in ta["ingredients"]:
    ing_id = ing["ingredientId"]
    if not ing_id in ingredient_map:
      print("did not find", ing_id, "when checking", ta["id"])

    ingredient_map[ing_id] += ing["amount"]
  if "finalTask" in ta:
    if ta["finalTask"]:
      final_tasks.append(ta["id"])
  task_map.add(ta["id"])
  with_time.append((ta["estimatedTime"], ta["name"]))


outgoing = {}
ingoing  = {}
for taskid in task_map:
  outgoing[taskid] = []
  ingoing[taskid]  = []

for dep in data["taskDependencies"]:
  to_id = dep["taskId"]
  if not to_id in task_map:
    print("did not find task with id:", to_id)
  else:
    depall = []
    
    if "dependsOn" in dep:
      depall += dep["dependsOn"]
    if "strongDependsOn" in dep:
      depall += dep["strongDependsOn"]
    
    for from_id in depall:
      if not from_id in task_map:
        print("did not find task with id:", from_id)
      else:
        outgoing[from_id].append(to_id)
        ingoing[to_id].append(from_id)
        
def traverse(visited, current, neighbors):
  visited.add(current)
  for n in neighbors[current]:
    traverse(visited, n, neighbors)

all_tasks_visited = set()
for fin in final_tasks:
  visit = set()
  traverse(visit, fin, ingoing)
  all_tasks_visited = all_tasks_visited.union(visit)

for task in task_map:
  if task not in all_tasks_visited:
    print(task, "is not connected to a final task")

for res in resource_map:
  if not resource_map[res]:
    print("resource is never used:", res)


for ing in ingredient_map:
    if ingredient_map[ing] == 0:
      print("Ingredient was not used:", ing)

if (len(sys.argv) > 2 and sys.argv[2] == "-v"):
  print("\n--- EXTRA INFO ---")
  print("id:  ", data["id"])
  print("name:", data["name"])

  print("\n-- finalTasks --")
  for ff in final_tasks:
    print(ff)

  print("\n-- Ingredienser --")
  for ing in ingredient_map:
      print("{:20} : {:5} {}".format(ing, ingredient_map[ing], ingredient_units[ing]))

  with_time.sort(key=lambda x: x[0])
  print("\n-- Sorterade tider --")
  for (t, name) in with_time:
    print("{:6} : {}".format(t, name))
