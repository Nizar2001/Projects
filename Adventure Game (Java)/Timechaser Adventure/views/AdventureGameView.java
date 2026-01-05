package views;

import AdventureModel.*;
import javafx.animation.Animation;
import javafx.animation.PauseTransition;
import javafx.application.Platform;
import javafx.event.ActionEvent;
import javafx.geometry.Insets;
import javafx.geometry.Pos;
import javafx.scene.Node;
import javafx.scene.Scene;
import javafx.scene.control.*;
import javafx.scene.input.MouseEvent;
import javafx.scene.media.Media;
import javafx.scene.media.MediaPlayer;
import javafx.scene.paint.Color;
import javafx.scene.layout.*;
import javafx.scene.input.KeyEvent; //you will need these!
import javafx.scene.input.KeyCode;
import javafx.scene.text.Font;
import javafx.scene.text.Text;
import javafx.stage.Stage;
import javafx.scene.image.Image;
import javafx.scene.image.ImageView;
import javafx.util.Duration;
import javafx.event.EventHandler; //you will need this too!
import javafx.scene.AccessibleRole;

import java.awt.event.TextEvent;
import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Arrays;

/**
 * Class AdventureGameView.
 *
 * This is the Class that will visualize your model.
 * You are asked to demo your visualization via a Zoom
 * recording. Place a link to your recording below.
 *
 * Google Drive LINK: <https://drive.google.com/file/d/17rEpDeOahBlHOs2a53qDH1kcXbpeWb83/view?usp=sharing>
 * PASSWORD: No password
 */
public class AdventureGameView {

    AdventureGame model; //model of the game
    Stage stage; //stage on which all is rendered
    Button saveButton, loadButton, helpButton, healthButton; //buttons
    Boolean helpToggle = false; //is help on display?

    GridPane gridPane = new GridPane(); //to hold images and buttons
    Label roomDescLabel = new Label(); //to hold room description and/or instructions
    VBox objectsInRoom = new VBox(); //to hold room items
    VBox objectsInInventory = new VBox(); //to hold inventory items
    ImageView roomImageView; //to hold room image
    TextField inputTextField; //for user input

    private MediaPlayer mediaPlayer; //to play audio
    private boolean mediaPlaying; //to know if the audio is playing


    /**
     * Adventure Game View Constructor
     * __________________________
     * Initializes attributes
     */

    public AdventureGameView(AdventureGame model, Stage stage) {
        this.model = model;
        this.stage = stage;
        playerSelectionScene();
    }

    public void playerSelectionScene() {
        this.stage.setTitle("Time Chaser Adventure");

        gridPane.setPadding(new Insets(20));
        gridPane.setBackground(new Background(new BackgroundFill(
                Color.valueOf("#000000"),
                new CornerRadii(0),
                new Insets(0)
        )));

        VBox main_box = new VBox();

        Label my_label = new Label();
        my_label.setAlignment(Pos.TOP_CENTER);

        Path path = Paths.get(model.getDirectoryName());

        // Get the file or directory name at the end of the path
        String gameName = path.getFileName().toString();

        my_label.setText("You have selected " + gameName + ". To begin, please choose a " +
                "player from the options below and embark on your journey through the enchanting realm of " + gameName);
        my_label.setStyle("-fx-text-fill: white; -fx-background-color: black; -fx-padding: 25px 20px 20px 20px;");
        my_label.setFont(new Font(25));
        my_label.setWrapText(true);

            HBox description_box = new HBox();
        ScrollPane scroll = new ScrollPane();
        scroll.setContent(my_label);
        scroll.setFitToWidth(true);
        scroll.setStyle("-fx-text-fill: white; -fx-background-color: white;"); // Set background color of the ScrollPane itself
        scroll.setPrefViewportHeight(105); // Set a fixed height for the ScrollPane

        description_box.getChildren().addAll(scroll);

        description_box.setAlignment(Pos.CENTER);


        String musicFile;
        String adventureName = this.model.getDirectoryName();
        musicFile = "./" + adventureName + "/sounds/" + "player_selection" + ".mp3";

        Media sound = new Media(new File(musicFile).toURI().toString());

        mediaPlayer = new MediaPlayer(sound);
        mediaPlayer.play();
        mediaPlaying = true;

        HBox bottomButtons = new HBox();

        HashMap<Button, EventHandler<MouseEvent>>  p_map = new HashMap<>();
        HashMap<Button, EventHandler<MouseEvent>>  p_image_map = new HashMap<>();

        ArrayList<String> clicked = new ArrayList<>();

        String directoryPath = this.model.getDirectoryName() + "/playerImages";
        File directory = new File(directoryPath);
        File[] files = directory.listFiles();
        if (files != null) {
            for (File file : files) {
                String fileName = file.getName();
                String[] stringArray = fileName.split("_");

                List<String> stringList = Arrays.asList(stringArray);
                String health = stringList.get(2).split("\\.")[0];

                Button player = new Button(stringList.get(0) + " " + stringList.get(1) + "\nHealth: " + health);
                player.setId(stringList.get(0) + " " + stringList.get(1) + "\nHealth: " + health);
                customizeButton(player, 150, 80);
                makeButtonAccessible(player, stringList.get(0) + " " + stringList.get(1),
                        "This button selects" + stringList.get(0) + " " + stringList.get(1) + ".",
                        "Click on it to get the player with which you want to complete the game.");

                Button p_image_button = get_image_button(fileName);
                VBox image_button = new VBox();
                image_button.getChildren().addAll(player, p_image_button);
                image_button.setSpacing(30);
                bottomButtons.getChildren().addAll(image_button);

                EventHandler<MouseEvent> player_handler = new EventHandler<MouseEvent>() {
                    public void handle(MouseEvent event) {
                        gridPane = new GridPane();

                        model.player.setName(stringList.get(0) + " " + stringList.get(1));
                        model.player.getHealth().set_health(Integer.parseInt(health));
                        stage.close();
                        mediaPlayer.stop();
                        intiUI();
                        clicked.add("yes");

                    }};
                    p_map.put(player, player_handler);
                    p_image_map.put(p_image_button, player_handler);

                }
            }
        for (Button player: p_map.keySet()){
            player.setOnMouseClicked(p_map.get(player));
            if (!clicked.isEmpty()){
                clicked.clear();
                break;}
        }

        for (Button player: p_image_map.keySet()){
            player.setOnMouseClicked(p_image_map.get(player));
            if (!clicked.isEmpty()){
                clicked.clear();
                break;}
        }


        bottomButtons.setSpacing(50);
        bottomButtons.setAlignment(Pos.BASELINE_CENTER);

        main_box.getChildren().addAll(description_box, bottomButtons);
        main_box.setSpacing(150);


        gridPane.add(main_box, 0, 0);
        gridPane.setAlignment(Pos.BOTTOM_CENTER);

        var scene = new Scene(gridPane, 1000, 700);
        scene.setFill(Color.BLACK);
        this.stage.setScene(scene);
        this.stage.setResizable(true);
        this.stage.show();}

    public Button get_image_button(String imageName) {
        String image_string = this.model.getDirectoryName() + "/playerImages/" + imageName;
        Image object_image = new Image(image_string);

        ImageView curr_image = new ImageView(object_image);

        curr_image.setPreserveRatio(true);
        curr_image.setFitWidth(150);
        curr_image.setFitHeight(150);

        curr_image.setAccessibleRole(AccessibleRole.IMAGE_VIEW);
        curr_image.setAccessibleText(imageName);
        curr_image.setFocusTraversable(true);


        Button curr_button = new Button();
        curr_button.setAccessibleText("THIS IS AN IMAGE OF A" + imageName);
        curr_button.setGraphic(curr_image);

        curr_button.setMaxWidth(140);
        curr_button.setMinWidth(140);
        curr_button.setMinHeight(140);
        curr_button.setMaxHeight(140);

        curr_button.setAlignment(Pos.CENTER);
        return curr_button;
    }





    /**
     * Initialize the UI
     */
    public void intiUI() {

        // setting up the stage
        this.stage.setTitle("Time Chaser Adventure"); //Replace <YOUR UTORID> with your UtorID

        //Inventory + Room items
        objectsInInventory.setSpacing(10);
        objectsInInventory.setAlignment(Pos.TOP_CENTER);
        objectsInRoom.setSpacing(10);
        objectsInRoom.setAlignment(Pos.TOP_CENTER);


        // GridPane, anyone?
        gridPane.setPadding(new Insets(20));
        gridPane.setBackground(new Background(new BackgroundFill(
                Color.valueOf("#000000"),
                new CornerRadii(0),
                new Insets(0)
        )));

        //Three columns, three rows for the GridPane
        ColumnConstraints column1 = new ColumnConstraints(150);
        ColumnConstraints column2 = new ColumnConstraints(650);
        ColumnConstraints column3 = new ColumnConstraints(150);
        column3.setHgrow( Priority.SOMETIMES ); //let some columns grow to take any extra space
        column1.setHgrow( Priority.SOMETIMES );

        // Row constraints
        RowConstraints row1 = new RowConstraints();
        RowConstraints row2 = new RowConstraints( 550 );
        RowConstraints row3 = new RowConstraints();
        row1.setVgrow( Priority.SOMETIMES );
        row3.setVgrow( Priority.SOMETIMES );

        gridPane.getColumnConstraints().addAll( column1 , column2 , column1 );
        gridPane.getRowConstraints().addAll( row1 , row2 , row1 );

        // Buttons
        saveButton = new Button("Save");
        saveButton.setId("Save");
        customizeButton(saveButton, 100, 50);
        makeButtonAccessible(saveButton, "Save Button", "This button saves the game.", "This button saves the game. Click it in order to save your current progress, so you can play more later.");
        addSaveEvent();

        loadButton = new Button("Load");
        loadButton.setId("Load");
        customizeButton(loadButton, 100, 50);
        makeButtonAccessible(loadButton, "Load Button", "This button loads a game from a file.", "This button loads the game from a file. Click it in order to load a game that you saved at a prior date.");
        addLoadEvent();

        helpButton = new Button("Instructions");
        helpButton.setId("Instructions");
        customizeButton(helpButton, 200, 50);
        makeButtonAccessible(helpButton, "Help Button", "This button gives game instructions.", "This button gives instructions on the game controls. Click it to learn how to play.");
        addInstructionEvent();

        String health = Integer.toString(model.getPlayer().getHealth().getHealthBar());
        healthButton = new Button("Health: " + health);
        healthButton.setId("Health: " + health);
        customizeButton(healthButton, 150, 50);
        makeButtonAccessible(healthButton, "Health Bar", "This button displays your health", "This button displays your health during the game and gets updated after you pick up some objects.");


        HBox topButtons = new HBox();
        topButtons.getChildren().addAll(saveButton, helpButton, loadButton, healthButton);
        topButtons.setSpacing(8);
        topButtons.setAlignment(Pos.CENTER);

        inputTextField = new TextField();
        inputTextField.setFont(new Font("Arial", 16));
        inputTextField.setFocusTraversable(true);

        inputTextField.setAccessibleRole(AccessibleRole.TEXT_AREA);
        inputTextField.setAccessibleRoleDescription("Text Entry Box");
        inputTextField.setAccessibleText("Enter commands in this box.");
        inputTextField.setAccessibleHelp("This is the area in which you can enter commands you would like to play.  Enter a command and hit return to continue.");
        addTextHandlingEvent(); //attach an event to this input field

        //labels for inventory and room items
        Label objLabel =  new Label("Objects in Room");
        objLabel.setAlignment(Pos.CENTER);
        objLabel.setStyle("-fx-text-fill: white;");
        objLabel.setFont(new Font("Arial", 16));

        Label invLabel =  new Label("Your Inventory");
        invLabel.setAlignment(Pos.CENTER);
        invLabel.setStyle("-fx-text-fill: white;");
        invLabel.setFont(new Font("Arial", 16));

        //add all the widgets to the GridPane
        gridPane.add( objLabel, 0, 0, 1, 1 );  // Add label
        gridPane.add( topButtons, 1, 0, 1, 1 );  // Add buttons
        gridPane.add( invLabel, 2, 0, 1, 1 );  // Add label

        Label commandLabel = new Label("What would you like to do?");
        commandLabel.setStyle("-fx-text-fill: white;");
        commandLabel.setFont(new Font("Arial", 16));

        updateScene(""); //method displays an image and whatever text is supplied
        updateItems(); //update items shows inventory and objects in rooms

        // adding the text area and submit button to a VBox
        VBox textEntry = new VBox();
        textEntry.setStyle("-fx-background-color: #000000;");
        textEntry.setPadding(new Insets(20, 20, 20, 20));
        textEntry.getChildren().addAll(commandLabel, inputTextField);
        textEntry.setSpacing(10);
        textEntry.setAlignment(Pos.CENTER);
        gridPane.add( textEntry, 0, 2, 3, 1 );

        // Render everything
        var scene = new Scene( gridPane ,  1000, 700);
        scene.setFill(Color.BLACK);
        this.stage.setScene(scene);
        this.stage.setResizable(false);
        this.stage.show();

    }


    /**
     * makeButtonAccessible
     * __________________________
     * For information about ARIA standards, see
     * https://www.w3.org/WAI/standards-guidelines/aria/
     *
     * @param inputButton the button to add screenreader hooks to
     * @param name ARIA name
     * @param shortString ARIA accessible text
     * @param longString ARIA accessible help text
     */
    public static void makeButtonAccessible(Button inputButton, String name, String shortString, String longString) {
        inputButton.setAccessibleRole(AccessibleRole.BUTTON);
        inputButton.setAccessibleRoleDescription(name);
        inputButton.setAccessibleText(shortString);
        inputButton.setAccessibleHelp(longString);
        inputButton.setFocusTraversable(true);
    }

    /**
     * customizeButton
     * __________________________
     *
     * @param inputButton the button to make stylish :)
     * @param w width
     * @param h height
     */
    private void customizeButton(Button inputButton, int w, int h) {
        inputButton.setPrefSize(w, h);
        inputButton.setFont(new Font("Arial", 16));
        inputButton.setStyle("-fx-background-color: #17871b; -fx-text-fill: white;");
    }

    /**
     * addTextHandlingEvent
     * __________________________
     * Add an event handler to the myTextField attribute
     *
     * Your event handler should respond when users
     * hits the ENTER or TAB KEY. If the user hits
     * the ENTER Key, strip white space from the
     * input to myTextField and pass the stripped
     * string to submitEvent for processing.
     *
     * If the user hits the TAB key, move the focus
     * of the scene onto any other node in the scene
     * graph by invoking requestFocus method.
     */
    private void addTextHandlingEvent() {
        inputTextField.setOnKeyPressed(e -> {
            if (e.getCode() == KeyCode.ENTER){
                String strippedString = inputTextField.getText().toUpperCase().strip();
                submitEvent(strippedString);
            } else if (e.getCode() == KeyCode.TAB){
                helpButton.requestFocus();
            }
        });
    }


    /**
     * submitEvent
     * __________________________
     *
     * @param text the command that needs to be processed
     */
    private void submitEvent(String text) {
        text = text.strip(); //get rid of white space
        stopArticulation(); //if speaking, stop

        if (text.equalsIgnoreCase("LOOK") || text.equalsIgnoreCase("L")) {
            String roomDesc = this.model.getPlayer().getCurrentRoom().getRoomDescription();
            String objectString = this.model.getPlayer().getCurrentRoom().getObjectString();
            if (!objectString.isEmpty()) roomDescLabel.setText(roomDesc + "\n\nObjects in this room:\n" + objectString);
            articulateRoomDescription(); //all we want, if we are looking, is to repeat description.
            return;
        } else if (text.equalsIgnoreCase("HELP") || text.equalsIgnoreCase("H")) {
            showInstructions();
            return;
        } else if (text.equalsIgnoreCase("COMMANDS") || text.equalsIgnoreCase("C")) {
            showCommands(); //this is new!  We did not have this command in A1
            return;
        }

        System.out.println("Your output: " + text);
        //try to move!
        String output = this.model.interpretAction(text); //process the command!


        if (output == null || (!output.equals("GAME OVER") && !output.equals("FORCED") && !output.equals("HELP"))) {
            updateScene(output);
            updateItems();
        } else if (output.equals("GAME OVER")) {
            model.player.getHealth().harm(-300);
            updateItems();
            PauseTransition pause = new PauseTransition(Duration.seconds(4));
            pause.setOnFinished(event -> {
                inputTextField.setDisable(false);
                Platform.exit();
            });
            pause.play();
        } else if (output.equals("FORCED")) {
            //write code here to handle "FORCED" events!
            //Your code will need to display the image in the
            //current room and pause, then transition to
            //the forced room.
            updateScene("");
            updateItems();
            PauseTransition pause = new PauseTransition(Duration.seconds(12));
            pause.setOnFinished(event -> {
                inputTextField.setDisable(false);
                if(this.model.getPlayer().getCurrentRoom().getCommands().equals("FORCED")) {
                    submitEvent("FORCED");
                } else {
                    updateScene("");
                    updateItems();
                }
            });
            pause.play();
            inputTextField.setDisable(true);

        }
    }


    /**
     * showCommands
     * __________________________
     *
     * update the text in the GUI (within roomDescLabel)
     * to show all the moves that are possible from the
     * current room.
     */
    private void showCommands() {
        String possibleMoves = this.model.getPlayer().getCurrentRoom().getCommands();
        roomDescLabel.setText(possibleMoves);
    }


    /**
     * updateScene
     * __________________________
     *
     * Show the current room, and print some text below it.
     * If the input parameter is not null, it will be displayed
     * below the image.
     * Otherwise, the current room description will be dispplayed
     * below the image.
     *
     * @param textToDisplay the text to display below the image.
     */
    public void updateScene(String textToDisplay) {
        String health = Integer.toString(model.getPlayer().getHealth().getHealthBar());
        healthButton.setText("Health: " + health);


        getRoomImage(); //get the image of the current room
        formatText(textToDisplay); //format the text to display
        roomDescLabel.setPrefWidth(500);
        roomDescLabel.setPrefHeight(500);
        roomDescLabel.setTextOverrun(OverrunStyle.CLIP);
        roomDescLabel.setWrapText(true);
        VBox roomPane = new VBox(roomImageView,roomDescLabel);
        roomPane.setPadding(new Insets(10));
        roomPane.setAlignment(Pos.TOP_CENTER);
        roomPane.setStyle("-fx-background-color: #000000;");

        gridPane.add(roomPane, 1, 1);
        stage.sizeToScene();

        //finally, articulate the description
        if (textToDisplay == null || textToDisplay.isBlank()) articulateRoomDescription();
    }

    /**
     * formatText
     * __________________________
     *
     * Format text for display.
     *
     * @param textToDisplay the text to be formatted for display.
     */
    private void formatText(String textToDisplay) {
        if (textToDisplay == null || textToDisplay.isBlank()) {
            String roomDesc = this.model.getPlayer().getCurrentRoom().getRoomDescription() + "\n";
            String objectString = this.model.getPlayer().getCurrentRoom().getObjectString();
            if (objectString != null && !objectString.isEmpty()) roomDescLabel.setText(roomDesc + "\n\nObjects in this room:\n" + objectString);
            else roomDescLabel.setText(roomDesc);
        } else roomDescLabel.setText(textToDisplay);
        roomDescLabel.setStyle("-fx-text-fill: white;");
        roomDescLabel.setFont(new Font("Arial", 16));
        roomDescLabel.setAlignment(Pos.CENTER);
    }

    /**
     * getRoomImage
     * __________________________
     *
     * Get the image for the current room and place
     * it in the roomImageView
     */
    private void getRoomImage() {

        int roomNumber = this.model.getPlayer().getCurrentRoom().getRoomNumber();
        String roomImage = this.model.getDirectoryName() + "/room-images/" + roomNumber + ".png";

        Image roomImageFile = new Image(roomImage);
        roomImageView = new ImageView(roomImageFile);
        roomImageView.setPreserveRatio(true);
        roomImageView.setFitWidth(400);
        roomImageView.setFitHeight(400);

        //set accessible text
        roomImageView.setAccessibleRole(AccessibleRole.IMAGE_VIEW);
        roomImageView.setAccessibleText(this.model.getPlayer().getCurrentRoom().getRoomDescription());
        roomImageView.setFocusTraversable(true);
    }

    /**
     * updateItems
     * __________________________
     *
     * This method is partially completed, but you are asked to finish it off.
     *
     * The method should populate the objectsInRoom and objectsInInventory Vboxes.
     * Each Vbox should contain a collection of nodes (Buttons, ImageViews, you can decide)
     * Each node represents a different object.
     *
     * Images of each object are in the assets
     * folders of the given adventure game.
     */
    public void updateItems() {

        //write some code here to add images of objects in a given room to the objectsInRoom Vbox
        //write some code here to add images of objects in a player's inventory room to the objectsInInventory Vbox
        //please use setAccessibleText to add "alt" descriptions to your images!
        //the path to the image of any is as follows:
        //this.model.getDirectoryName() + "/objectImages/" + objectName + ".jpg";
        // Show the images of the objects in the current room under objectsInRoom

        // clear the two Vbox before adding to either
        ScrollPane scO = new ScrollPane(objectsInRoom);
        scO.setPadding(new Insets(10));
        scO.setStyle("-fx-background: #000000; -fx-background-color:transparent;");
        scO.setFitToWidth(true);
        gridPane.add(scO, 0, 1);

        ArrayList<AdventureObject> objects = this.model.getPlayer().getCurrentRoom().objectsInRoom;
        objectsInRoom.getChildren().clear();

        for (AdventureObject obj : objects) {
            String image_string = this.model.getDirectoryName() + "/objectImages/" + obj.getName() + ".jpg";
            Image object_image = new Image(image_string);

            ImageView curr_image = new ImageView(object_image);

            curr_image.setPreserveRatio(true);
            curr_image.setFitWidth(100);
            curr_image.setFitHeight(100);

            curr_image.setAccessibleRole(AccessibleRole.IMAGE_VIEW);
            curr_image.setAccessibleText(obj.getName());
            curr_image.setFocusTraversable(true);

            Button curr_button = new Button();
            curr_button.setAccessibleText("THIS IS AN IMAGE OF A" + obj.getName());
            curr_button.setGraphic(curr_image);

            curr_button.setMaxWidth(110);
            curr_button.setMinWidth(110);
            curr_button.setMinHeight(100);
            curr_button.setMaxHeight(100);

            Text my_text = new Text(obj.getName());
            my_text.setFont(new Font(16));

            curr_button.setAlignment(Pos.TOP_RIGHT);

            StackPane my_stackpane = new StackPane();
            my_stackpane.getChildren().addAll(curr_button, my_text);

            StackPane.setAlignment(curr_button, Pos.TOP_RIGHT);
            StackPane.setAlignment(my_text, Pos.BOTTOM_CENTER);

            objectsInRoom.getChildren().add(my_stackpane);


            EventHandler<MouseEvent> eventHandler = new EventHandler<MouseEvent>() {
                public void handle(MouseEvent event) {
                    submitEvent("TAKE " + obj.getName().toUpperCase().trim());
                    model.getPlayer().takeObject(obj.getName());
                    objectsInRoom.getChildren().remove(my_stackpane);
                }
            };

            curr_button.setOnMouseClicked(eventHandler);

            keyboard_take(obj.getName(), my_stackpane);
        }


        ScrollPane scI = new ScrollPane(objectsInInventory);
        scI.setFitToWidth(true);
        scI.setStyle("-fx-background: #000000; -fx-background-color:transparent;");
        gridPane.add(scI, 2, 1);


        objectsInInventory.getChildren().clear();
        for (String obj : model.getPlayer().getInventory()) {
            String image_string = this.model.getDirectoryName() + "/objectImages/" + obj + ".jpg";
            Image object_image = new Image(image_string);

            ImageView curr_image = new ImageView(object_image);

            curr_image.setPreserveRatio(true);
            curr_image.setFitWidth(100);
            curr_image.setFitHeight(100);

            curr_image.setAccessibleRole(AccessibleRole.IMAGE_VIEW);
            curr_image.setAccessibleText(obj);
            curr_image.setFocusTraversable(true);


            Button curr_button = new Button();
            curr_button.setAccessibleText("THIS IS AN IMAGE OF A" + obj);
            curr_button.setGraphic(curr_image);

            curr_button.setMaxWidth(110);
            curr_button.setMinWidth(110);
            curr_button.setMinHeight(100);
            curr_button.setMaxHeight(100);

            Text my_text = new Text(obj);
            my_text.setFont(new Font(16));

            curr_button.setAlignment(Pos.TOP_RIGHT);

            StackPane my_stackpane = new StackPane();
            my_stackpane.getChildren().addAll(curr_button, my_text);
            my_stackpane.setId(obj);

            StackPane.setAlignment(curr_button, Pos.TOP_RIGHT);
            StackPane.setAlignment(my_text, Pos.BOTTOM_CENTER);

            objectsInInventory.getChildren().add(my_stackpane);


            EventHandler<MouseEvent> eventHandler = new EventHandler<MouseEvent>() {
                public void handle(MouseEvent event) {
                    submitEvent("DROP " + obj.toUpperCase().trim());
                    model.getPlayer().dropObject(obj);
                    objectsInInventory.getChildren().remove(my_stackpane);
                }
            };

            curr_button.setOnMouseClicked(eventHandler);

            addTextHandlingEvent();}
    }

    private void keyboard_take(String obj, StackPane stack){
        inputTextField.setOnKeyPressed(my_event -> {
            if (my_event.getCode() == KeyCode.ENTER){
                String my_text = inputTextField.getText().trim();
                submitEvent(my_text);
                String[] my_lst = model.tokenize(my_text);
                if (my_lst.length == 2 && my_lst[0].equals("TAKE") && my_lst[1].equals(obj.toUpperCase())){
                    objectsInRoom.getChildren().remove(stack);}
            }
        });
    }

    /*
     * Show the game instructions.
     *
     * If helpToggle is FALSE:
     * -- display the help text in the CENTRE of the gridPane (i.e. within cell 1,1)
     * -- use whatever GUI elements to get the job done!
     * -- set the helpToggle to TRUE
     * -- REMOVE whatever nodes are within the cell beforehand!
     *
     * If helpToggle is TRUE:
     * -- redraw the room image in the CENTRE of the gridPane (i.e. within cell 1,1)
     * -- set the helpToggle to FALSE
     * -- Again, REMOVE whatever nodes are within the cell beforehand!
     */
    public void showInstructions() {
        if (helpToggle.equals(false)) {
            Label my_label = new Label();
            my_label.setText(model.getInstructions());
            my_label.setStyle("-fx-text-fill: white; -fx-background-color: black; -fx-padding: 25px 20px 20px 20px;");
            my_label.setFont(new Font(17));
            my_label.setWrapText(true);

            ScrollPane scroll = new ScrollPane();
            scroll.setContent(my_label);
            scroll.setFitToWidth(true);


            gridPane.setAlignment(Pos.CENTER);
            gridPane.getChildren().removeIf(node -> GridPane.getRowIndex(node) == 1 && GridPane.getColumnIndex(node) == 1);


            gridPane.add(scroll, 1, 1);
            helpToggle = true;
        }
        else{

            helpToggle = false;
            gridPane.getChildren().removeIf(node -> GridPane.getRowIndex(node) == 1 && GridPane.getColumnIndex(node) == 1);

            getRoomImage();

            this.formatText("");


            VBox roomPane = new VBox(roomImageView, roomDescLabel);
            roomPane.setPadding(new Insets(10));
            roomPane.setAlignment(Pos.TOP_CENTER);
            roomPane.setStyle("-fx-background-color: #000000;");

            gridPane.add(roomPane, 1, 1);
            articulateRoomDescription();
        }
    }

    /**
     * This method handles the event related to the
     * help button.
     */
    public void addInstructionEvent() {
        helpButton.setOnAction(e -> {
            stopArticulation(); //if speaking, stop
            showInstructions();
        });
    }

    /**
     * This method handles the event related to the
     * save button.
     */
    public void addSaveEvent() {
        saveButton.setOnAction(e -> {
            gridPane.requestFocus();
            SaveView saveView = new SaveView(this);
        });
    }

    /**
     * This method handles the event related to the
     * load button.
     */
    public void addLoadEvent() {
        loadButton.setOnAction(e -> {
            gridPane.requestFocus();
            LoadView loadView = new LoadView(this);
        });
    }


    /**
     * This method articulates Room Descriptions
     */
    public void articulateRoomDescription() {
        String musicFile;
        String adventureName = this.model.getDirectoryName();
        String roomName = this.model.getPlayer().getCurrentRoom().getRoomName();

        if (!this.model.getPlayer().getCurrentRoom().getVisited()) musicFile = "./" + adventureName + "/sounds/" + roomName.toLowerCase() + "-long.mp3" ;
        else musicFile = "./" + adventureName + "/sounds/" + roomName.toLowerCase() + "-short.mp3" ;
        musicFile = musicFile.replace(" ","-");

        Media sound = new Media(new File(musicFile).toURI().toString());

        mediaPlayer = new MediaPlayer(sound);
        mediaPlayer.play();
        mediaPlaying = true;

    }

    /**
     * This method stops articulations 
     * (useful when transitioning to a new room or loading a new game)
     */
    public void stopArticulation() {
        if (mediaPlaying) {
            mediaPlayer.stop(); //shush!
            mediaPlaying = false;
        }
    }
}
