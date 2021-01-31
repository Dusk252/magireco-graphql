import os
import sys
import getopt
import pymongo
import dns
import charListDownloader
import jsonTransform

# set environment variables for mongo connection
import setEnv


def update_mongo_db(from_file):
    client = pymongo.MongoClient(
        os.environ.get('MONGO_DB_CONNECTION_STR')
    )
    db = client['magireco-api']
    collection = db['charaList']

    if from_file:
        parsed_data = jsonTransform.process_json_from_file()
    else:
        data = charListDownloader.download_char()
        parsed_data = jsonTransform.process_json(data)

    bulk_ops = []
    for chara in parsed_data['charaList']:
        upsert_doc = pymongo.UpdateOne(
            {'charaId': chara['charaId']}, {"$set": chara}, True)
        bulk_ops.append(upsert_doc)

    bulk_op_result = collection.bulk_write(bulk_ops)
    print('mongodb update success')
    print('updated records: ', bulk_op_result.upserted_count)
    client.close()


def main(argv):
    download = False
    try:
        opts, _ = getopt.getopt(argv, "hd")
    except getopt.GetoptError:
        print('mongoUpdater.py [-d]')
        sys.exit()
    for opt, _ in opts:
        if opt == '-h':
            print('mongoUpdater.py [-d]')
            sys.exit()
        elif opt == '-d':
            download = True
    update_mongo_db(not download)


if __name__ == "__main__":
    main(sys.argv[1:])
