package AdventureModel;

import java.io.Serializable; //you will need this to save the game!

/**
 * This class keeps track of the props or the objects in the game.
 * These objects have a name, description, and location in the game.
 * The player with the objects can pick or drop them as they like and
 * these objects can be used to pass certain passages in the game.
 */
public class AdventureObject implements Serializable {
    /**
     * The name of the object.
     */
    private String objectName;

    /**
     * The description of the object.
     */
    private String description;

    /**
     * The location of the object.
     */
    private Room location = null;

    /**
     * The effect of object on the player.

     * If health_effect is positive, then the player is healed by <health_effect>,
     * and if it is negative the player is damaged by <health_effect>.

     * The health of the player is not affected if <health_effect> is zero.

     */

    private Integer health_effect;

    /**
     * Whether the object is previously picked or not

     * If the object is previously picked, it doesn't affect the health of the player.

     */
    private boolean is_picked;

    /**
     * Adventure Object Constructor
     * ___________________________
     * This constructor sets the name, description, and location of the object.
     *
     * @param name The name of the Object in the game.
     * @param description One line description of the Object.
     * @param location The location of the Object in the game.
     */
    public AdventureObject(String name, String description, Room location,
                           Integer healthEffect){
        this.objectName = name;
        this.description = description;
        this.location = location;
        this.health_effect = healthEffect;
        this.is_picked = false;
    }

    /**
     * Getter method for the name attribute.
     *
     * @return name of the object
     */
    public String getName(){
        return this.objectName;
    }

    /**
     * Getter method for the description attribute.
     *
     * @return description of the game
     */
    public String getDescription(){
        return this.description;
    }


    /**
     * Getter method for health_effect attribute
     *
     * @return the effect of object on the player.
     */

    public Integer getHealth_effect(){return this.health_effect;}

    /**
     * This method returns the location of the object if the object is still in
     * the room. If the object has been pickUp up by the player, it returns null.
     *
     * @return returns the location of the object if the objects is still in
     * the room otherwise, returns null.
     */
    public Room getLocation(){
        return this.location;
    }


    /**
     * Getter method for is_picked attribute.
     *
     * @return the value of is_picked.
     */
    public boolean previously_picked(){
        return this.is_picked;
    }

    /**
     * Sets the value of is_picked to true, meaning that the object is picked.
     */
    public void set_picked(){
        is_picked = true;
    }

}
