from flask import Flask
import openai
import os
import json

from tools import send_token

os.environ["OPENAI"] = "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"

openai.api_key = os.environ["OPENAI"]

app = Flask(__name__)

@app.route("/solver", methods=["GET"])
def welcome():
    prompt = "Send 1 ETH token to address xyz"
    systemPrompt = "You are a helpful assistant that assists the user to execute crypto transactions."

    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages = [
            {
                "role": "system",
                "content": systemPrompt
            },
            {
                "role": "user",
                "content": prompt,
            }
        ],
        functions = [
            {
                "name": "send_token",
                "description": "Send a given amount of a token to a given address",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "token": {
                            "type": "string",
                            "enum": ["USDC", "ETH"]
                        },
                        "amount": {
                            "type": "integer",
                            "description": "The amount of the token being sent, e.g. 2.05"
                        },
                        "address": {
                            "type": "string",
                            "description": "The address that the tokens are being sent to"
                        }
                    },
                    "required": ["token, amount, address"]
                }
            }
        ],
        function_call="auto",
    )

    output = response.choices[0].message
    chosen_function = eval(output.function_call.name)
    params = json.loads(output.function_call.arguments)
    function_result = chosen_function(**params)

    return function_result

    # if response.get("function_call"):
    #     available_functions = {
    #         "send_token": send_token,
    #     }
    #     function_name = response["function_call"]["name"]
    #     function_to_call = available_functions[function_name]
    #     function_args = json.loads(response["function_call"]["arguments"])
    #     function_response = function_to_call(
    #         token=function_args.get("token"),
    #         amount=function_args.get("amount"),
    #         address=function_args.get("address"),
    #     )

    #     messages.append(response)
    #     messages.append(
    #         {
    #             "role": "function",
    #             "name": function_name,
    #             "content": function_response,
    #         }
    #     )
    #     second_response = openai.ChatCompletion.create(
    #         model="gpt-3.5-turbo",
    #         messages=messages
    #     )
    #     return second_response

    return response

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=105)