from api import app

from ariadne import load_schema_from_path, make_executable_schema, \
    graphql_sync, snake_case_fallback_resolvers, ObjectType
#from ariadne.constants import PLAYGROUND_HTML
from flask import request, jsonify


from api.schemas.openAi import openAi
from api.resolvers.openAi import openAI_resolver

@app.route("/graphql", methods=["GET"])
def graphql_playground():
    html = """
    <div style="width: 100%; height: 100%;" id='embedded-sandbox'></div>
    <script src="https://embeddable-sandbox.cdn.apollographql.com/_latest/embeddable-sandbox.umd.production.min.js"></script> 
    <script>
    new window.EmbeddedSandbox({
        target: '#embedded-sandbox',
        initialEndpoint: 'http://localhost:8080/graphql',
        includeCookies: false,
    });
    </script>
    """
    return html, 200

graphql_resolver = {
    "type":openAi["type"],
    "query":openAi["query"],
    "mutation":openAi["mutation"],
    "query_resolver":openAI_resolver["queries"],
    "mutations_resolver":openAI_resolver["mutations"]
}

type_defs = ""
type=[]
query=[]
mutation=[]
objs = [graphql_resolver]

query_resolver = ObjectType("Query")

mutation_resolver = ObjectType("Mutation")
for ob in objs:
    type.append(ob["type"])
    query.append(ob["query"])
    mutation.append(ob["mutation"])
    for item in ob["query_resolver"]:
        query_resolver.set_field(item,ob["query_resolver"][item])
  
    for item in ob["mutations_resolver"]:
        mutation_resolver.set_field(item,ob["mutations_resolver"][item])





type_defs = "\n".join(type)+"\n"+"type Query { \n"+"\n".join(query)+"} \n type Mutation {"+"\n".join(mutation)+"\n }"

schema = make_executable_schema(
    type_defs,query_resolver,mutation_resolver, snake_case_fallback_resolvers
)


@app.route("/graphql", methods=["POST"])
def graphql_server():
    data = request.get_json()
    success, result = graphql_sync(
        schema,
        data,
        context_value=request,
        debug=app.debug
    )
    status_code = 200 if success else 400
    return jsonify(result), status_code