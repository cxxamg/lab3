package resource;

import java.util.logging.Logger;

import DAO.ResultDAO;
import DTO.Result;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.CookieParam;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import script.Script;

@Path("/points")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class PointResource {
    private static final Logger logger = Logger.getLogger(PointResource.class.getName());

    @GET
    public Result pointResource(@QueryParam("x") String x, @QueryParam("y") String y, @QueryParam("r") String r, @CookieParam("user") String user){
        logger.info("cookie: " + user);
        String[] request = {x,y,r};
        Result res = Script.run(request);
        if (res != null){
            ResultDAO.instantiate(res, user);
            //ReaderEnv.readEnv();
            return res;
        }
        return null;
    }
    
}
