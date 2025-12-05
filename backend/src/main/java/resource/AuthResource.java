package resource;


import java.util.logging.Logger;

import DAO.UserDAO;
import DTO.User;
import DTO.UserPass;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

@Path("/authResponce")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class AuthResource {
    private static final Logger logger = Logger.getLogger(AuthResource.class.getName());

    @POST
    @Path("/auth")
    public UserPass authResource(User user){
        logger.info("auth данные прибыли" + user.login()+  user.password());
        UserPass responce = UserDAO.comparePasswords(user);
        logger.info("ответ готовится: "+ responce.msg());
        return responce;
    }

    @POST
    @Path("/reg")
    public UserPass regResource(User user){
        logger.info("reg данные прибыли" + user.login()+  user.password());
        if (UserDAO.isUserExists(user)) {
            return new UserPass(false, "Пользователь уже существует");
        } else {
            UserDAO.instantiateAddUser(user);
            logger.info("новый пользователь: "+ user.login());
            return new UserPass(true, "Пользователь зарегестрирован");
        }
    }
}
