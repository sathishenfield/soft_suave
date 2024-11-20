package com.ss.client.ui;

import com.google.gwt.core.client.GWT;
import com.google.gwt.uibinder.client.UiBinder;
import com.google.gwt.uibinder.client.UiField;
import com.google.gwt.user.client.ui.Button;
import com.google.gwt.user.client.ui.TextBox;
import com.google.gwt.user.client.ui.Widget;
import com.google.gwt.user.client.ui.Composite;

public class MainPageView extends Composite {
    interface MainPageUiBinder extends UiBinder<Widget, MainPageView> {}
    private static final MainPageUiBinder uiBinder = GWT.create(MainPageUiBinder.class);

    @UiField
    TextBox inputBox;

    @UiField
    Button submitButton;

    public MainPageView() {
        initWidget(uiBinder.createAndBindUi(this));
    }

    public TextBox getInputBox() {
        return inputBox;
    }

    public Button getSubmitButton() {
        return submitButton;
    }
}
