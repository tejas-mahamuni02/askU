from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from pymongo import MongoClient
from datetime import datetime

# MongoDB setup
client = MongoClient("mongodb://localhost:27017/")
db = client["AskU"]  #  database name
collection = db["questions"]       # collection name
counter_collection = db["counters"]  # For tracking the last inserted integer ID

# Create a counter document if it doesn't exist
if not counter_collection.find_one({"_id": "ans_counter"}):
    counter_collection.insert_one({"_id": "ans_counter", "seq": 0})
# Function to get the next integer ID
def get_next_ans_id():
    counter = counter_collection.find_one_and_update(
        {"_id": "ans_counter"},
        {"$inc": {"seq": 1}},
        return_document=True
    )
    return counter["seq"]

@api_view(['POST'])
def givenAnswer(request,question):
   if request.method == 'POST':
        try:
            # Insert a new document with a custom integer ID
            new_ans = request.data
            # new_ans["_id"] = get_next_ans_id()  # Set the custom integer ID
            new_ans["answer_id"] = get_next_ans_id()  # Set the custom integer ID
            new_ans["created_at"] = datetime.now().isoformat()
            new_ans["likes"]=0
          
            result = collection.update_one(
                    {"_id": question},  # Find the question by its unique _id
                    {"$push": {"answers": new_ans}}  # Push the new answer to the 'answers' array
                )
            # collection1.insert_one(new_ans)
            if result.matched_count == 0:
                return Response({"error": "Question not found."}, status=status.HTTP_404_NOT_FOUND)
            return Response(new_ans, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    

# @api_view(['PUT','GET', 'DELETE'])
# def editAnswer(request,id):
#     try:
#         # Find the user by custom integer `id`
#         answer = collection1.find_one({"_id": id}, {"_id": 0})
#         if not answer:
#             return Response({"error": "Question not found"}, status=status.HTTP_404_NOT_FOUND)
#     except Exception as e:
#         return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
#     if request.method == 'GET':
#         return Response(answer)
    
#     elif request.method == 'PUT':
#         # Update the drink with new data
#         updated_data = request.data
#         collection1.update_one({"_id": id}, {"$set": updated_data})
#         return Response(updated_data)
    
#     elif request.method == 'DELETE':
#         # Delete the drink by custom integer `id`
#         collection1.delete_one({"_id": id})
#         return Response(status=status.HTTP_204_NO_CONTENT)
    
  