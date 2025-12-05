package resource;


import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;


@Path("/hello")
public class HelloResource {

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response hello(@QueryParam("name") String name) {
        String message = name != null && !name.isEmpty() ? "Hello, " + name + "!" : "Hello from Backend!";
        long timestamp = System.currentTimeMillis();
        
        String json = String.format("{\"message\": \"%s\", \"timestamp\": %d}", 
                                    message.replace("\"", "\\\""), timestamp);
        
        return Response.ok()
                .entity(json)
                .build();
    }

    @POST
    @Path("/echo")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response echo(String data) {
        return Response.ok()
                .entity("{\"echo\": " + data + ", \"received\": true}")
                .build();
    }
}

