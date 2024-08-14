export async function graphql(q,values,user,callback){
    let headers =  {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers":
        "Origin, X-Requested-With, Content-Type, Accept"
      };
      if(user) {
        //headers["authorization"] = `${user.user.name} ${user.accessToken}`;
      }
      const server = process.env.REACT_APP_SERVER;
      await fetch(server, {
          method: "POST",
          headers: headers,
          body: JSON.stringify({
            query: q,
            variables: values,
          }),
        })
          .then((res) => res.json())
          .then((info, err) => {
               if(!err) {
                 callback(info.data);
               }
               else {
                   console.log(err);
               }
          });
}