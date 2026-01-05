import AdventureModel.AdventureGame;
import javafx.application.Application;
import javafx.stage.Stage;
import views.AdventureGameView;
import views.MapSelectionScene;

import java.io.IOException;
import java.util.Scanner;

/**
 * Class AdventureGameApp.
 */
public class AdventureGameApp extends  Application {

    MapSelectionScene model;

    public static void main(String[] args) {
        launch(args);
    }

    /*
    * JavaFX is a Framework, and to use it we will have to
    * respect its control flow!  To start the game, we need
    * to call "launch" which will in turn call "start" ...
     */
    @Override
    public void start(Stage primaryStage) throws IOException {

    MapSelectionScene map = new MapSelectionScene(primaryStage);
    map.playerSelectionScene();


    }

}
