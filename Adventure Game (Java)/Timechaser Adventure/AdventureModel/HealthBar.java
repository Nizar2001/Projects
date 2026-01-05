package AdventureModel;

/**
 * A HealthBar class keeping track of the well-being of the player in the game.
 */
public class HealthBar {
    /**
     * The current health of the player.
     * If <current_health == 0>, then the player is dead.
     */
    private Integer current_health;

    /**
     * HealthBar Constructor
     *  ___________________
     * This constructs the current_health of the player.
     */
    public HealthBar() {
        this.current_health = 100;
    }

    /**
     * A Getter method for the current_health
     *
     * @return the current_health of the player
     */
    public int getHealthBar(){
        return current_health;
    }

    /**
     * Heal the current player (increase current_health)
     *
     * Do not let current_health exceed 200.
     *
     * @param quantity The quantity by which the health would increase.
     *
     */
    public void heal(Integer quantity){
        if (current_health + quantity > 200){
            current_health = 200;
        }
        else{
            current_health += quantity;}}

    /**
     * Harm the current player (decrease current_health)
     *
     * Do not let current_health fall below 0.
     *
     * @param quantity The quantity by which the health would decrease.
     */

    public void harm(Integer quantity){
        if (current_health + quantity < 0){
            current_health = 0;
        }
        else{
            current_health += quantity;}
    }

    /**
     * A setter method for current_health.
     *
     *
     * @param quantity Set the value of current_health to the value of quantity.
     */
    public void set_health(Integer quantity){
        this.current_health = quantity;
    }
}
