from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from pymongo import MongoClient
from datetime import datetime
from bson.json_util import dumps
import json

# logging.basicConfig(level=logging.DEBUG)

# MongoDB setup
client = MongoClient("mongodb://localhost:27017/")
db = client["AskU"]  #  database name
collection1 = db["questions"]       # collection name
counter_collection = db["counters"]  # For tracking the last inserted integer ID

# Create a counter document if it doesn't exist
if not counter_collection.find_one({"_id": "que_counter"}):
    counter_collection.insert_one({"_id": "que_counter", "seq": 0})
# Function to get the next integer ID
def get_next_que_id():
    counter = counter_collection.find_one_and_update(
        {"_id": "que_counter"},
        {"$inc": {"seq": 1}},
        return_document=True
    )
    return counter["seq"]

@api_view(['POST'])
def askedQuestion(request):
   if request.method == 'POST':
        # Insert a new document with a custom integer ID
        new_que = request.data
        new_que["_id"] = get_next_que_id()  # Set the custom integer ID
        new_que["created_at"] = datetime.now().isoformat()
        new_que["answers"] = []
        collection1.insert_one(new_que)
        return Response(new_que, status=status.HTTP_201_CREATED)

@api_view(['PUT','GET', 'DELETE'])
def editQuestion(request,id):
    try:
        # Find the user by custom integer `id`
        question = collection1.find_one({"_id": id})
        if not question:
            return Response({"error": "Question not found"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    if request.method == 'GET':
        return Response(question)
    
    elif request.method == 'PUT':
        # Update the drink with new data
        updated_data = request.data
        collection1.update_one({"_id": id}, {"$set": updated_data})
        return Response(updated_data)
    
    elif request.method == 'DELETE':
        # Delete the drink by custom integer `id`
        collection1.delete_one({"_id": id})
        # return Response(status=status.HTTP_204_NO_CONTENT)
 
 



@api_view(['GET'])
def getAllQueOfSameUser(request,email):
    try:
        # Find the user by custom integer `id`
        questions = list(collection1.find({"user.email": email}))
        if not questions:
            return Response({"error": "Question not found"}, status=status.HTTP_404_NOT_FOUND)
    
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    if request.method == 'GET':
        return Response(questions)
    

@api_view(['GET'])
def getAllQue(request,email):
    try:
        # Fetch questions where the user's email does not match the provided email
        questions = list(collection1.find({"user.email": {"$ne": email}}))

        if not questions:
            return Response({"error": "No questions found"}, status=status.HTTP_404_NOT_FOUND)

        # Convert MongoDB documents to JSON
        questions_json = json.loads(dumps(questions))
        return Response(questions_json, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# @api_view(['GET'])
# def getAllQue(request,email):
#     try:
#         # Find the user by custom integer `id`
#         questions = list(collection1.find({"user.email": {"$ne": email}}))
#         if not questions:
#             return Response({"error": "Question not found"}, status=status.HTTP_404_NOT_FOUND)
#     except Exception as e:
#         return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
#     if request.method == 'GET':
#         return Response(questions)
    
    
# @api_view(['POST'])
# def addLike(request, question_id, answer_id):
    
#     try:
#         logging.debug(f"Request to like answer: question_id={question_id}, answer_id={answer_id}")
#         question_id = ObjectId(question_id)
#         answer_id = ObjectId(answer_id)
        
        
#         # Increment the likes count for the specific answer in the specific question
#         result = collection1.update_one(
#     {"_id": question_id, "answers._id": answer_id},  # Correct query structure
#     {"$inc": {"answers.$.likes": 1}}  # Increment the likes count
# )

        
#         if result.modified_count == 0:
#             return Response({"error": "Like update failed"}, status=status.HTTP_404_NOT_FOUND)

#         # Fetch the updated answer to return
#         updated_question = collection1.find_one(
#             {"_id": question_id, "answers._id": answer_id},
#             {"answers.$": 1}
#         )
#         updated_answer = updated_question["answers"][0]

#         return Response({"likes": updated_answer["likes"]}, status=status.HTTP_200_OK)
#     except Exception as e:
#         return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST','DELETE'])
def addlike(request, question_id, answer_id):
    if request.method=="POST":
        try:
            # Increment the likes count for the specific answer
            result = collection1.update_one(
                {"_id": question_id, "answers.answer_id": answer_id},  # Fixing query for the correct field
                {"$inc": {"answers.$.likes": 1}}  # Increment the likes
            )

            if result.modified_count == 0:
                return Response({"error": "Like update failed"}, status=status.HTTP_404_NOT_FOUND)

            # Fetch the updated answer
            updated_question = collection1.find_one(
                {"_id": question_id, "answers.answer_id": answer_id},
                {"answers.$": 1}
            )
            updated_answer = updated_question["answers"][0]

            return Response({"likes": updated_answer["likes"]}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['DELETE'])
def delete_answer(request, question_id, answer_id):
    try:

        # Remove the specific answer from the answers array
        result = collection1.update_one(
            {"_id": question_id},
            {"$pull": {"answers": {"answer_id": answer_id}}}  # Pull the specific answer
        )

        # Check if the answer was deleted
        if result.modified_count == 0:
            return Response(
                {"error": "Answer not found or already deleted"},
                status=status.HTTP_404_NOT_FOUND
            )

        return Response(
            {"message": "Answer deleted successfully"},
            status=status.HTTP_200_OK
        )

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)






   
    
  