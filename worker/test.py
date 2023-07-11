import utils, sys


data = utils.fetch_unlinked_files()
for e in data:
    try:
        utils.remove_weaviate_entry_by_id(e[0])
    except Exception as e:
        print(e)
        pass

item = utils.fetch_item(sys.argv[1])
data = utils.index_directus_report_item_to_weaviate(item)
# print(data)
# item = utils.fetch_item(sys.argv[1])
# x = utils.index_directus_report_item_to_weaviate(item)
# print(x)

# for e in x:
#     print(e['id'])