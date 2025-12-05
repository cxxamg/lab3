package models;

import java.util.ArrayList;
import java.util.List;

import DTO.Result;


public class ResultHistory {
    private final List<Result> history = new ArrayList<>();

    public List<Result> getHistory() {
        return this.history;
    }

    public void addResultToHistory(Result result) {
        this.history.add(result);
    }
}
