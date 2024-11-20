package com.ss.client.ui;

import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.dom.client.ClickHandler;

public class MainPagePresenter {
    private final MainPageView view;

    public MainPagePresenter(MainPageView view) {
        this.view = view;
    }

    public void bind() {
        view.getSubmitButton().addClickHandler(new ClickHandler() {
            @Override
            public void onClick(ClickEvent event) {
                String inputText = view.getInputBox().getText();
                System.out.println("User input: " + inputText);
            }
        });
    }
}

