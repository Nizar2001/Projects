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
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Arrays;

import java.util.function.Function;

public class MapSelectionScene {
    Stage stage; //stage on which all is rendered

    GridPane gridPane = new GridPane(); //to hold images and buttons

    private MediaPlayer mediaPlayer; //to play audio
    private boolean mediaPlaying; //to know if the audio is playing

    public MapSelectionScene(Stage stage) {
        this.stage = stage;
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
        my_label.setText("\"Welcome to the Time Chaser Adventure! Ready for some fun? Select your desired map and let the quest begin!\"");
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
        musicFile = "./intro/game_intro.mp3";

        Media sound = new Media(new File(musicFile).toURI().toString());

        mediaPlayer = new MediaPlayer(sound);
        mediaPlayer.play();
        mediaPlaying = true;





        HBox bottomButtons = new HBox();

        HashMap<Button, EventHandler<MouseEvent>> p_map = new HashMap<>();
        HashMap<Button, EventHandler<MouseEvent>> p_image_map = new HashMap<>();

        ArrayList<String> clicked = new ArrayList<>();

        String directoryPath = "./maps";
        File directory = new File(directoryPath);
        File[] files = directory.listFiles();
        if (files != null) {
            for (File file : files) {
                String fileName = file.getName();
                String[] stringArray = fileName.split("\\.");

                List<String> stringList = Arrays.asList(stringArray);
                String gameName = stringList.get(0);

                Button map = new Button(gameName);
                map.setId(gameName);
                customizeButton(map, 400, 100);
                makeButtonAccessible(map, gameName,
                        "This button selects" + gameName + ".",
                        "Click on it to select the map want to play.");

                Button map_image_button = get_image_button(fileName);
                customizeButton(map_image_button, 300, 200);
                VBox image_button = new VBox();
                image_button.getChildren().addAll(map, map_image_button);
                image_button.setSpacing(20);
                bottomButtons.getChildren().addAll(image_button);

                EventHandler<MouseEvent> map_handler = new EventHandler<MouseEvent>() {
                    public void handle(MouseEvent event) {
                        gridPane = new GridPane();
                        stage.close();
                        mediaPlayer.stop();
                        AdventureGame model = new AdventureGame(gameName);
                        AdventureGameView view = new AdventureGameView(model, stage);

                        clicked.add("yes");


                    }
                };
                p_map.put(map, map_handler);
                p_image_map.put(map_image_button, map_handler);

            }
        }
        for (Button player : p_map.keySet()) {
            player.setOnMouseClicked(p_map.get(player));
            if (!clicked.isEmpty()) {
                clicked.clear();
                break;
            }
        }

        for (Button player : p_image_map.keySet()) {
            player.setOnMouseClicked(p_image_map.get(player));
            if (!clicked.isEmpty()) {
                clicked.clear();
                break;
            }
        }


        bottomButtons.setSpacing(50);
        bottomButtons.setAlignment(Pos.BASELINE_CENTER);

        main_box.getChildren().addAll(description_box, bottomButtons);
        main_box.setSpacing(100);


        gridPane.add(main_box, 0, 0);
        gridPane.setAlignment(Pos.BOTTOM_CENTER);

        var scene = new Scene(gridPane, 1000, 700);
        scene.setFill(Color.BLACK);
        this.stage.setScene(scene);
        this.stage.setResizable(true);
        this.stage.show();}

    public Button get_image_button(String imageName) {
        String image_string = "./maps/" + imageName;
        Image object_image = new Image(image_string);

        ImageView curr_image = new ImageView(object_image);

        curr_image.setPreserveRatio(true);
        curr_image.setFitWidth(400);
        curr_image.setFitHeight(300);

        curr_image.setAccessibleRole(AccessibleRole.IMAGE_VIEW);
        curr_image.setAccessibleText(imageName);
        curr_image.setFocusTraversable(true);


        Button curr_button = new Button();
        curr_button.setAccessibleText("THIS IS AN IMAGE OF A" + imageName);
        curr_button.setGraphic(curr_image);

        curr_button.setAlignment(Pos.CENTER);
        return curr_button;
    }

    public static void makeButtonAccessible(Button inputButton, String name, String shortString, String longString) {
        inputButton.setAccessibleRole(AccessibleRole.BUTTON);
        inputButton.setAccessibleRoleDescription(name);
        inputButton.setAccessibleText(shortString);
        inputButton.setAccessibleHelp(longString);
        inputButton.setFocusTraversable(true);
    }

    private void customizeButton(Button inputButton, int w, int h) {
        inputButton.setPrefSize(w, h);
        inputButton.setFont(new Font("Arial", 16));
        inputButton.setStyle("-fx-background-color: #17871b; -fx-text-fill: white;");
    }

}
