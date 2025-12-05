package tools;

public class Parser {
    public static boolean parse(String[] params) {
        try {
            for (int i = 0; i < params.length; i++) {
                params[i] = params[i].replace(',', '.');
                Double.parseDouble(params[i]);
            }
        } catch (NumberFormatException e) {
            return false;
        }
        return true;
    }
}


