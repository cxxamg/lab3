package tools.hash;

import org.mindrot.jbcrypt.BCrypt;

public class Hasher {
    public static String hashPassword(String password){
        return BCrypt.hashpw(password, BCrypt.gensalt(7));
    }

    public static boolean isMatch(String password, String hashed){
        return BCrypt.checkpw(password,hashed);
    }

}
