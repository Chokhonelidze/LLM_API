import time,os,json
from langchain_openai import ChatOpenAI
from openai import OpenAI

def getText(obj,info,text):
    try:
        llm = ChatOpenAI(api_key=os.environ['OPENAI_API_KEY'])
        str = llm.invoke(text+"give me summarization as graphql and provide schema for it")
        print(str,flush=True)
        payload = {
            "success": True,
            "message": str
        }
    except Exception as error:
        payload = {
            "success": False,
            "errors": [str(error)]
        }
    return payload

def getTextAsync(obj,info):
    try:
        time.sleep(10)
        payload = {
            "success": True,
            "message": "sync test"
        }
    except Exception as error:
        payload = {
            "success": False,
            "errors": [str(error)]
        }
    return payload

def fakeMutation(obj,info):
    return True

def acord125Forms(obj,info):
    try:
        #llm = ChatOpenAI(api_key=os.environ['OPENAI_API_KEY'])
        client = OpenAI(
            # This is the default and can be omitted
            api_key=os.environ.get("OPENAI_API_KEY"),
        )
        

        schema = """
                type ApplicantInfo {
                businessName: String!
                address: String!
                contactDetails: String!
                businessType: String!
                }

                type InsuranceCoverage {
                coverageType: String!
                coverageAmount: Float!
                }

                type BusinessOperation {
                description: String!
                locations: [String!]!
                additionalInsured: [String!]
                }

                type PriorInsurance {
                policyNumber: String!
                insurer: String!
                coverageType: String!
                expirationDate: String!
                claimsMade: [String!]
                }

                type LossHistory {
                date: String!
                description: String!
                amountPaid: Float!
                }

                type Signatures {
                applicantSignature: String!
                date: String!
                agentSignature: String
                }

                type ACORD125Form {
                applicantInfo: ApplicantInfo!
                insuranceCoverages: [InsuranceCoverage!]!
                businessOperations: BusinessOperation!
                priorInsurance: [PriorInsurance!]!
                lossHistory: [LossHistory!]!
                signatures: Signatures!
                }
        """
        #str = llm.invoke("use graphql schema: "+schema+"/n summarize random accord 125 document and give me summarization" )
        messages = [ 
            {"role": "user", "content": "use graphql schema: "+schema+" find random accord 125 document and sumarize it output provided graphql schema format"}
        ] 
        str = client.chat.completions.create(model="gpt-3.5-turbo",messages=messages)
        data = [msg.message.content for msg in str.choices]
        js = json.loads(data[0])  
        payload = {
            "success":True,
            "data":js['data']['ACORD125Form']
        }

    except Exception as error:
        payload = {
            "success": False,
            "errors": [str(error)]
        }
    return payload

queries = {
   "getText":getText,
   "getTimeAsync":getTextAsync,
   "acord125Forms":acord125Forms
}
mutations = {
    "fakeMutation":fakeMutation
} 
test_resolver = {
    "queries":queries,
    "mutations":mutations
}