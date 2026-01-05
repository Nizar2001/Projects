# The random_function on line (1619) generates a pseudorandom number
# The algorithm used to impelement the function is called 
# Linear Congruential Generator (LCG) which was published
# in 1958  W. E. Thomson and A. Rotenberg.

# [1] GeeksforGeeks. 2022. Linear Congruence Method for Generating Pseudo-Random Numbers.
# Retrieved October 18, 2024, from https://www.geeksforgeeks.org/linear-congruence-method-for-generating-pseudo-random-numbers/

# [2] Wikipedia. 2024. Linear Congruential Generator. Retrieved October 18, 2024 from 
# https://en.wikipedia.org/wiki/Linear_congruential_generator


# The two enhancements I chose are providing a multiplayer competitive mode and the cheat sheet
# For multiplayer competitive mode, the following functions were implemented:
# Lines (173-184). These lines are meant to get the number of players from the user and store the 
# value in data memory, specifcally in "players"
#
# The storeboard funtion in line (615) are responsible for providing the same gameboard for each player,
# and asking each player to play the same game
#
# The code in start_game section in the lines (654) is used to keep track of the highest number for each player 
# and calls the "store_number_of_moves" function to keep track of the number of moves each player made
# to complete the game.

# The start_game function is called n times where n is the number of players. In otherwords, the
# start_game function is called for each player to display the gameboard to them and keep track of their moves

# The start_game function also checks whether all players have completed their games, and if they do, 
# the leaderboard will be generated. 

# The leaderboard function implemented on line (1262) is another important function that sorts the leaderboard
# based on the number of moves for each player. It also uses a function called "add_number" in combination with sort
# To map each player identifier to their respective moves. 
# This ensures printing the leaderboard correctly and organizing the players based on the number of moves they made to 
# complete the game.



# For the cheat sheet, the lines (859-865) checks whether the user input matches the cheat codes
# like (1234 and 2024) and based on that input stores the appropriate cheat_codes for the user

# If the user has typed 1234 as the cheat code, then the "switch_to_target" funtion on line (1585)is called
# and the character will move to the target postion


# Otherwise, if the player has typed 2024, then the "win_game" on line (1598) function is called, and the player wins
# the game with their the current number of moves



.data
gridsize:   .byte 0,0
character:  .byte 0,0
box:        .byte 0,0 
target:     .byte 0,0

character2: .byte 0,0
box2:       .byte 0,0
values: .byte 0, 0, 0, 0

seed: .word 0

row_size: .string "Enter the number of rows (between 6 and 255) or 5 to restart: "
column_size: .string "Enter the number of columns (between 6 and 255) or 5 to restart: "

invalid_size: .string "Opps! You provided an invalid number for rows or columns\nEnter a number between 5 and 255\n"


dash_lines: .string "-----------------------------------------------------------------------------------\n\n"
equal_lines: .string "\n========================================================================================-"
wall_symbol: .string "#"
character_symbol: .string "@"
target_symbol: .string "X"
box_symbol: .string "%"
char: .string "#"
blank: .string " "
dblank: .string "                    "


move_to_target: .word 1234
undo_move: .word 2024


welcome: .string "Welcome to Shiftlock!\n\n"

begins: .string "The Game Begins!\n"
restarting: .string "\n\n\n\n----------------------------------------------------------------\nRestarting The Game...\nThe Game Begins!\n\n"

leave: .string "If you wish to exit, enter 0\n"
try_again: .string "Opps Invalid input\nTry Again or Press 0 to exit\n"
thank_you: .string "\nThank you for playing Shiftlock!\nWe hope you enjoyed it\n"

play_instruction: .string "\n\nTo play the game, move your character (@) by typing one of the following numbers:\n1: Move up\n2: Move down\n3: Move left\n4: Move right\nTo win the game, move the box (%) to the target (X).\n"
enter_move: .string "Please enter a move: " 
enter_next_move: .string "\nPlease enter your next move or enter (5 or 9) to restart or end the game: "
wrong_input: .string "Oops! Invalid input.\nPlease enter an integer between 1 and 5: "
restart: .string "To restart the game, type 5 and then press the Enter key!\nTo end the game, type 9!\n"
restart_game: .string "\n\nTo restart the game, type 5 and then press the Enter key or\npress any other key to end the game: "

moved_up: .string "You moved up!\n"
moved_down: .string "You moved down!\n"
moved_left: .string "You moved left!\n"
moved_right: .string "You moved right!\n"

not_moved_up: .string "\nYou're at the upper boundary and can't move up further"
not_moved_down: .string "\nYou're at the lower boundary and can't move down further"
not_moved_left: .string "\nYou're at the left boundary and can't move left further"
not_moved_right: .string "\nYou're at the right boundary and can't move right further"

box_not_up: .string "\nThe box is at the upper boundary and can't move up further"
box_not_down: .string "\nThe box is at the lower boundary and can't move down further"
box_not_left: .string "\nThe box is at the left boundary and can't move left further"
box_not_right: .string "\nThe box is at the right boundary and can't move right further"

newline: .string "\n"
dnewline: .string "\n\n\n"
congrats: .string "\n\nCongratulations!!!\nYou completed the game!\n"


number_of_players: .string "Please Enter the number of players that plays the game: "
welcome_player: .string "Welcome Player "
player_ranking: .string ") Player "
leaderboard_message: .string "Great job! The game has ended. Here are the final scores for each player\n\n"

moves: .string "Moves: "
move_to_beat: .string "Score to beat: "



players: .word 0


.text
.globl _start

_start:

	
	li a7, 4
	la a0, welcome
	ecall

	enter_grid:		
	li t0, 6
	li t1, 256

	li a7, 4
	la a0, row_size			# Get the row from player
	ecall
	
	li a7, 5
	ecall
	mv t3, a0	

	li a7, 4
	la a0, newline
	ecall

	li t5, 5
	beq t5, t3, _start

	blt t3, t0, invalid_grid		# Check if row entered is within the range (5 - 255)
	bge t3, t1, invalid_grid
	
	li a7, 4
	la a0, column_size			# Get the column from player
	ecall			


	li a7, 5					
	ecall
	mv t4, a0


	li a7, 4						# Add newline
	la a0, newline
	ecall
	
	li a7, 4
	la a0, newline					# Add newline
	ecall


	li t5, 5
	beq t5, t4, _start				# If the input is 5 restart

	blt t4, t0, invalid_grid		# Check if column entered is within the range (5 - 255)
	bge t4, t1, invalid_grid
	

	la t0, gridsize
	sb t3, 0(t0)
	sb t4, 1(t0)
	
	j valid_grid
	
	invalid_grid:				
		
		li a7, 4
		la a0, invalid_size
		ecall
		
		li a7, 4
		la a0, newline
		ecall
		
		j enter_grid
		
		
		


	valid_grid: 
						
	li a7, 4					#Enhacement 1
	la a0, number_of_players	#Ask for the number of players
	ecall
								
	li a7, 5					
	ecall
								#Enhacement 1
	la t0, players				# Get the user input and store it
	addi t0, t0, 3     		 	# Add 3 to t0 to ensure rounding up
	andi t0, t0, 0xFFFFFFFC  

	sw a0, 0(t0)				# Store in memory for later use
	


	li a7, 4
	la a0, begins
	ecall

	j Get_Box




	Restart:
		li a7, 4
		la a0, restarting
		ecall

	Get_Box:

		la a0, gridsize
		lbu a0, 1(a0)

									# Get Coordinate of the box
		addi a0, a0, -2				# Reduce the range to [0, a - 3] as putting in 
									# positions (x, y) where x, y ∈ {a-1, a-2} makes the 
									# game unsolveable. where a is the value stored in a0
									
	# Get the x-coordinate of Box

		addi a0, a0, -2 			# The code gives the accurate positions for the box, that
		jal ra, random_function				# makes the game solveable. 
		addi a0, a0, 2				# This location where box can be at is anywhere between 2,
									# and a-2

		la t0, box
		sb a0, 0(t0)				# store the x-coordinate of box


		la a0, gridsize
		lbu a0, 0(a0)
		addi a0, a0, -2
									

	# Get the y-coordinate of Box


		addi a0, a0, -2 			# The code gives the accurate positions for the box, that
		jal ra, random_function				# makes the game solveable. 
		addi a0, a0, 2				# This location where box can be at is anywhere between 2,
									# and a-2

		la t0, box
		sb a0, 1(t0)				# store the y-coordinate of the box


	Get_Target:
		la a0, gridsize
		lbu a0, 1(a0)

									# Get Coordinates for the Target
		addi a0, a0, -1				# Reduce the range to [0, a - 2) as putting target at 
									# position (x, y) where x, y ∈ {a-1}, puts that target
									# on the top of the walls. a = number of columns in grid minus 1
		
		
		addi a0, a0, -1 			# Get the x-coordinate for target
		jal ra, random_function				 
		addi a0, a0, 1

		#x-coordinate of target

		la t0, target	
		sb a0, 0(t0)				# Store the x-coordinate of target			


		la a0, gridsize
		lbu a0, 0(a0)
	
		addi a0, a0, -2					
		jal ra, random_function				# Get the y coordinate for target 
		addi a0, a0, 1

		la t0, target
		sb a0, 1(t0)				# Store the y-coordinate of target


		lbu t0, 0(t0)				# x_coordinate of target

		la t1, box
		lbu t1, 0(t1)				# x-coordinate of box
					


		beq t0, t1, check_box_target_y	# If box and target have similar x-coordinates								# Check for their y-coordinate,
		
	Get_character:
		la a0, gridsize
		lbu a0, 1(a0)
						
									# Get Coordinates for the Character
		addi a0, a0, -1				# Reduce the range to [0, a - 2) as, similar to target,
									# putting the character at position (x, y) where
									# x, y ∈ {a-1}, puts that target on the top of the
									# walls. where a = number of rows in grid minus 1
		
		
		addi a0, a0, -1 			# Get the x-coordinate for the character
		jal ra, random_function			 
		addi a0, a0, 1

		#x-coordinate of target

		la t0, character	
		sb a0, 0(t0)				# Store the x-coordinate of character in memory


		
		la a0, gridsize
		lbu a0, 0(a0)
	
		addi a0, a0, -2					
		jal ra, random_function			# Get the y coordinate for character
		addi a0, a0, 1

		la t0, character
		sb a0, 1(t0)				# Store the y-coordinate for character in memory

	
		la s1, character			# Store the x-coordinate of character in s1
		lbu s1, 0(s1)

		la s2, box					# Store the x-coordinate of box in s2
		lbu s2, 0(s2)


		
		beq s1, s2, check_box_character_y
	
		continue:	
	
		la s2, target				# Store the x-coordinate of target in t1
		lbu s2, 0(s2)
		
		beq s1, s2, check_target_character_y
		
		j Add_constant


	# Check if the box and target and similar y-coordinates. If they do, place the
	# target at a different location

	check_box_target_y:
		la t0, box					#y_coordinate of box
		lbu t0, 1(t0)				

		la t1, target
		lbu t1, 1(t1)				#y_coordinate of target


		beq t1, t0,	Get_Target
		j Get_character
		

	# Check if the box and character and similar y-coordinates. If they do, place the
	# character at a different location

		
	check_box_character_y:
		la t0, box					#y_coordinate of box
		lbu t0, 1(t0)				

		la t1, character
		lbu t1, 1(t1)				#y_coordinate of character


		beq t1, t0,	Get_character
		j continue



	# Check if the target and character and similar y-coordinates. If they do, place the
	# character at a different location


	check_target_character_y:
		la t0, target					#y_coordinate of target
		lbu t0, 1(t0)				

		la t1, character
		lbu t1, 1(t1)				#y_coordinate of character


		beq t1, t0,	Get_character
		j Add_constant
		




    # TODO: Generate locations for the character, box, and target. Static
    # locations in memory have been provided for the (x, y) coordinates 
    # of each of these elements.
    # 
    # There is a notrand function that you can use to start with. It's 
    # really not very good; you will replace it with your own rand function
    # later. Regardless of the source of your "random" locations, make 
    # sure that none of the items are on top of each other and that the 
    # board is solvable.
   
    # TODO: Now, print the gameboard. Select symbols to represent the walls,
    # character, box, and target. Write a function that uses the location of
    # the various elements (in memory) to construct a gameboard and that 
    # prints that board one character at a time.
    # HINT: You may wish to construct the string that represents the board
    # and then print that string with a single syscall. If you do this, 
    # consider whether you want to place this string in static memory or 
    # on the stack. 


	Add_constant:

	li s8, 1

	Generate_board:	

	la t0, gridsize
	lbu t0, 1(t0)		# Get the horizontal length of grid

	# Now we find at which iteration of loop we will get to the positions of 
	# Target, box and character and based on those, generate board

	# We use the formula f(m, n) = (m + 1) + (x+1)n
	# Where m and n are the coordinates of target, player and box
	# And x is the second element of gridsize
	
	addi t0, t0, 1			# this gives (x+1) and stores it in t0


	la t1, target			# Load the address of target in t1
	lbu t2, 1(t1)			# get n and store it in t2
	lbu t1, 0(t1)			# get m and store it in t1
	addi t1, t1, 1			# this stores (m + 1) in t1
	mul t2, t0, t2			# This stores (x+1)n in t2
	add t2, t2, t1			# Adds (x+1)n to (m+1)
	mv s5, t2				# The iteration at which target_symbol should be inserted


	la t1, character			# Load the address of target in t1
	lbu t2, 1(t1)			# get n and store it in t2
	lbu t1, 0(t1)			# get m and store it in t1
	addi t1, t1, 1			# this stores (m + 1) in t1
	mul t2, t0, t2			# This stores (x+1)n in t2
	add t2, t2, t1			# Adds (x+1)n to (m+1)
	mv s6, t2				# The iteration at which target_symbol should be inserted


	la t1, box				# Load the address of target in t1
	lbu t2, 1(t1)			# get n and store it in t2
	lbu t1, 0(t1)			# get m and store it in t1
	addi t1, t1, 1			# this stores (m + 1) in t1
	mul t2, t0, t2			# This stores (x+1)n in t2
	add t2, t2, t1			# Adds (x+1)n to (m+1)
	mv s7, t2				# The iteration at which target_symbol should be inserted




	la t0, gridsize
	lbu t1, 1(t0)	#Store the value at index 1 of val in t1
	lbu t0, 0(t0)	#Store the value at index 0 of val in t0


	mul t1, t0, t1			# multuply the rows and columns to get the number of "#"'s
	add t1, t1, t0			# add the value in t0 to store space for newline character
	addi t1, t1, 1			# Store space for null terminator
	
	addi t0, t1, 3     		 # Add 3 to t0 to ensure rounding up
	andi t0, t0, 0xFFFFFFFC  # figure out the amount of memory necessary to store 
	addi t0, t0, 12			 # Just for safety allocating additional 3 bytes

	li t3, -1			
	mul t0, t0, t3			# Convert to negative
	

	mv a1, sp				# store the intital value of sp
							# so that sp can be set to its intial
							#values afterwards

	andi sp, sp, 0xFFFFFFFC
	add sp, sp, t0

	mv s4, sp				# store sp in s4 for printing the string
	addi s4, s4, 1			

						
	
	mv s0, t1 				# End of string
	li s1, 1				# Counter
	li s2, 0				# location of value to insert char at

	

	loop:
		li t1, 4					# See if 4 bytes have been stored in values already
		
		li s3, 1
		beq t1, s2, store_byte		# If yes, store them on stack

		continue_loop:

		beq s1, s0, Add_null	# if we have reached the end of string then exit
		

	

		beq s1, s5, insert_target
		beq s1, s6, insert_character
		beq s1, s7, insert_box


		la t0, gridsize		
		lbu t0, 1(t0)				#insert the top wall
		addi t1, t0, 1
		blt s1, t1, insert_wall


						#insert the bottom wall
		addi t1, t0, 1
		sub t1, s0, t1
		bge s1, t1, insert_wall

	
		sub t1, s1, t0							
		addi t2, t0, 1
		remu t1, t1, t2							#insert right wall
		beq t1, x0, insert_wall


									
		
		addi t1, t0, 1					#insert left wall
		addi t2, s1, -1
		remu t1, t2, t1
		beq t1, x0, insert_wall
					
		


		la t0, blank	# store "#" in t0
		lbu t0, 0(t0)			
		
		la t1, values
		add t1, t1, s2			
		
		sb t0, 0(t1)			#store "#" to the ith position of values
		addi s2, s2, 1			# increment the index of values


		next:


		addi s1, s1, 1			# increment counter
		
		la t1, gridsize
		lbu t1, 1(t1)			# If the next index is a multiple of the length of row
								# add a new line
		addi t1, t1, 1

		remu t1, s1, t1			
		beq t1, x0, add_newline		


		j loop




    # TODO: Enter a loop and wait for user input. Whenever user input is
    # received, update the gameboard state with the new location of the 
    # player (and if applicable, box and target). Print a message if the 
    # input received is invalid or if it results in no change to the game 
    # state. Otherwise, print the updated game state. 
    #
    # You will also need to restart the game if the user requests it and 
    # indicate when the box is located in the same position as the target.
    # For the former, it may be useful for this loop to exist in a function,
    # to make it cleaner to exit the game loop.

	store_board:
		mv sp, s4
		addi sp, sp, -1			#Enhacement 1
		
		mv s10, s4				# Store the original board in s10
		li s11, 1 				# counter for the number of players


		la t0, box
		lbu t1, 1(t0)			# Store the original y-coordinate of box in t1
		lbu t0, 0(t0)			# Store the original x-coordinate of box in t0
		
		la t2, box2
		sb t1, 1(t2)			# Store the original y-coordinate of box in box2
		sb t0, 0(t2)			# Store the original x-coordinate of box in box2		

		la t0, character
		lbu t1, 1(t0)			# Store the original y-coordinate of character in t0
		lbu t0, 0(t0)			# Store the original x-coordinate of character in t1
		
		la t2, character2
		sb t1, 1(t2)			# Store the original y-coordinate in character2
		sb t0, 0(t2)			# Store the original x-coordinate in character2	

		
		la t0, players
		addi t0, t0, 3     		 	# Add 3 to t0 to ensure rounding up
		andi t0, t0, 0xFFFFFFFC 	# This ensures that the address of "players"
									# is aligned to 4
		lw t0, 0(t0)

		li t1, -1		
		mul t0, t0, t1				# Allocate space on stack for the number
		add sp, sp, t0				# moves for each player. This can be used to 
		addi sp, sp, 3				# create the leaderboard
		andi sp, sp, 0xFFFFFFFC
		addi sp, sp, -1

	
	start_game:
	
		mv a0, s11						# Store the location where the value
		addi a0, a0, -1					# for number of moves will be stored
		li t1, 2
		bge s11, t1, store_number_of_moves
		li a5, 0						# Keep track of the highset score

		after_stored:


		li a2, 0				# count the number of moves
								# for each player						




		la t0, players
		addi t0, t0, 3     		 	# Add 3 to t0 to ensure rounding up
		andi t0, t0, 0xFFFFFFFC 	# This ensures that the address of "players"
									# is aligned to 4
		lw t0, 0(t0)				# Get the number of players
		addi t0, t0, 1


		bge s11, t0, leaderboard	#If all players played the game
									# Go to leaderboard and display result
		
		li a7, 4
		la a0, dash_lines			# Display dash lines to seperate the game
		ecall	

		li a7, 4							
		la a0, welcome_player
		ecall
		
		li a7, 1
		mv a0, s11
		ecall

		li a7, 4
		la a0, newline
		ecall

		mv a0, s10		
		li a7, 4				# Print the board
		ecall

		li a7, 4
		la a0, newline
		ecall


		li a7, 4		
		la a0, moves			# Print the player's current move
		ecall 
		
		mv a0, a2
		li a7, 1				
		ecall

		li a7, 4
		la a0, newline
		ecall

		la a0, move_to_beat
		li a7, 4				# Print the score to beat
		ecall

		li a7, 1
		mv a0, a5				
		ecall
		

		li a7, 4
		la a0, newline
		ecall


		la t0, box2
		lbu t1, 1(t0)			# Store the y-coordinate of box2 in t1
		lbu t0, 0(t0)			# Store the x-coordinate of box2 in t0
		
		la t2, box
		sb t1, 1(t2)			# Store the y-coordinate of box in box
		sb t0, 0(t2)			# Store the x-coordinate of box in box		

		la t0, character2
		lbu t1, 1(t0)			# Store the y-coordinate of character in t0
		lbu t0, 0(t0)			# Store the x-coordinate of character in t1
		
		la t2, character
		sb t1, 1(t2)			# Store the original y-coordinate in character
		sb t0, 0(t2)			# Store the original x-coordinate in character				


		
	play_game:
		li s8, 2		
	
		
		li a7, 4
		la a0, play_instruction
		ecall
		
		li a7, 4
		la a0, restart
		ecall

		li a7, 4
		la a0, enter_move
		ecall

		li a7, 5
		ecall

		j continue_input

		enter_input:
			
			li t0, 1						# Print to the user that the player cannot be moved up
			beq s9, t0, not_up

			li t0, 2
			beq s9, t0, not_down			# Print to the user that the player cannot be moved down

			li t0, 3
			beq s9, t0, not_left			# Print to the user that the player cannot be moved left


			li t0, 4
			beq s9, t0, not_right			# Print to the user that the player cannot be right
			

			li t0, 5						# Print to the user that the box cannot move up
			beq s9, t0, not_box_up

			li t0, 6
			beq s9, t0, not_box_down			# Print to the user that the box cannot move down

			li t0, 7
			beq s9, t0, not_box_left			# Print to the user that the box cannot move left

			li t0, 8
			beq s9, t0, not_box_right			# Print to the user that the box cannot move right

			
			ask_input:

		li a7, 4
		la a0, newline
		ecall


		li a7, 4		
		la a0, moves			# Print the player's current move
		ecall 
		
		mv a0, a2
		li a7, 1				
		ecall

		li a7, 4
		la a0, newline
		ecall

		la a0, move_to_beat
		li a7, 4				# Print the score to beat
		ecall

		li a7, 1
		mv a0, a5				
		ecall
		

		li a7, 4
		la a0, newline
		ecall



			li s9, 0
		
			li a7, 4
			la a0, enter_next_move
			ecall

			li a7, 5
			ecall

			continue_input:


			mv t0, a0
			
			li t1, 9
			beq t0, t1, exit

			li t1, 5					# If the input is 5, restart the game
			beq t1, t0, _start

			addi a2, a2, 1	# Increment the number of moves for
										# the player



			li t1, 1234
			beq t0, t1, switch_to_target

			li t1, 2024
			beq t0, t1, win_game

									
			li t1, 1				# If the user has entered 1 move the player up
			beq t1, t0, move_up

			li t1, 2
			beq t1, t0, move_down	# If the user has entered 2, move the player down
		
			li t1, 3
			beq t1, t0, move_left	# If the user has entered 2, move the player left

			li t1, 4
			beq t1, t0, move_right	# If the user has entered 2, move the player right


			addi a2, a2, -1				# decrement the number of moves for
										# the player since the input is invalid

			li a7, 4
			la a0, newline
			ecall

			li a7, 4
			la a0, wrong_input
			ecall
			
			j ask_input
				
			
	

	move_up:
		la t0, character
		lbu t0, 1(t0)				# The y-coordinate of the character
		addi t0, t0, -1

		li s9, 1
		beq t0, x0, Generate_board
		li s9, 0

		la t0, character
		lbu t0, 0(t0)				# The x-coordinate of character

		la t1, box
		lbu t1, 0(t1)				# Get the x-coordinate of the box

		bne t0, t1, continue_up
		
		# Check if box and character have similar y-coordinate after player moved up
			la t0, character
			lbu t0, 1(t0)				# The y-coordinate of the character
			addi t0, t0, -1
	
			la t1, box
			lbu t1, 1(t1)				# The y-coordinate of box
			
			bne t0, t1, continue_up		# If the player is not in the same location as 
										# the box after movement, the box cannot be moved
			
			li s9, 5					# Record that the box cannot be moved up
			li t2, 1
			beq t1, t2, Generate_board	#If the box is at the top of board,
			li s9, 0					# it cannot be moved
			
			la t0, box
			addi t1, t1, -1				# Move the box up by one position
			sb t1, 1(t0)
			
			la t0, target				# Get the y-coordinate of the target
			lbu t0, 1(t0)	

			bne t0, t1, continue_up
			
			la t0, target			# Get the x-coordinate of the target
			lbu t0, 0(t0)	

			la t1, box			# Get the x-coordinate of the box
			lbu t1, 0(t1)

			bne t0, t1, continue_up	
			
			li a7, 4
			la a0, congrats
			ecall
			
			addi s11, s11, 1
		
			j start_game
		continue_up:

		la t0, character
		lbu t1, 1(t0)				# The y-coordinate of the character
		addi t1, t1, -1
		sb t1, 1(t0)

		j Generate_board


	move_down:
		la t0, character
		lbu t0, 1(t0)				# The y-coordinate of the character
		addi t0, t0, 1

		la t1, gridsize				# Get the number of rows for the grid
		lbu t1, 0(t1)
		addi t1, t1, -1

		li s9, 2
		beq t0, t1, Generate_board
		li s9, 0

		la t0, character
		lbu t0, 0(t0)				# The x-coordinate of character

		la t1, box
		lbu t1, 0(t1)				# Get the x-coordinate of the box

		bne t0, t1, continue_down
		
		# Check if box and character have similar y-coordinate after player moved down
			la t0, character
			lbu t0, 1(t0)				# The y-coordinate of the character
			addi t0, t0, 1
	
			la t1, box
			lbu t1, 1(t1)				# The y-coordinate of box
			
			bne t0, t1, continue_down		# If the player is not in the same location as 
										# the box after movement, the box cannot be moved
			

			la t2, gridsize				# Get the number of rows for the grid
			lbu t2, 0(t2)
			addi t2, t2, -2

			li s9, 6					# Record that the box cannot be moved down
			beq t1, t2, Generate_board	#If the box is at the bottom of board,
			li s9, 0								# it cannot be moved
			
			la t0, box
			addi t1, t1, 1				# Move the box down by one position
			sb t1, 1(t0)
			
			la t0, target				# Get the y-coordinate of the target
			lbu t0, 1(t0)	

			bne t0, t1, continue_down
			
			la t0, target			# Get the x-coordinate of the target
			lbu t0, 0(t0)	

			la t1, box			# Get the x-coordinate of the box
			lbu t1, 0(t1)

			bne t0, t1, continue_down
			
			li a7, 4
			la a0, congrats
			ecall
			
			addi s11, s11, 1
		
			j start_game

		continue_down:

		la t0, character
		lbu t1, 1(t0)				# The y-coordinate of the character
		addi t1, t1, 1
		sb t1, 1(t0)


		j Generate_board		



	move_left:

		la t0, character
		lbu t0, 0(t0)				# The x-coordinate of the character
		addi t0, t0, -1

		li s9, 3
		beq t0, x0, Generate_board	# IF the player is at the far left, dont move
		li s9, 0

		la t0, character
		lbu t0, 1(t0)				# The y-coordinate of character

		la t1, box
		lbu t1, 1(t1)				# Get the y-coordinate of the box

		bne t0, t1, continue_left
		
		# Check if box and character have similar x-coordinate after player moved left
		la t0, character
		lbu t0, 0(t0)				# The x-coordinate of the character
		addi t0, t0, -1
	
		la t1, box
		lbu t1, 0(t1)				# The x-coordinate of box
			
		bne t0, t1, continue_left		# If the player is not in the same location as 
											#the box after movement, the box cannot be moved

		li s9, 7					# Record that the box cannot be moved left
		li t2, 1
		beq t1, t2, Generate_board	#If the box is at the far left of board,
		li s9, 0									# it cannot be moved to the left further
			
		la t0, box
		lbu t1, 0(t0)
		addi t1, t1, -1				# Move the box left by one position
		sb t1, 0(t0)
			
		la t0, target				# Get the x-coordinate of the target
		lbu t0, 0(t0)	

		bne t0, t1, continue_left
			
		la t0, target			# Get the y-coordinate of the target
		lbu t0, 1(t0)	

		la t1, box			# Get the y-coordinate of the box
		lbu t1, 1(t1)

		bne t0, t1, continue_left
			
		li a7, 4
		la a0, congrats
		ecall
			
		addi s11, s11, 1
		
		j start_game

		continue_left:

			la t0, character
			lbu t1, 0(t0)				# The x-coordinate of the character
			addi t1, t1, -1
			sb t1, 0(t0)

			j Generate_board

	move_right:

		la t0, character
		lbu t0, 0(t0)					# The x-coordinate of the character
		addi t0, t0, 1

		la t1, gridsize	
		lbu t1, 1(t1)					# Get the number of columns of the grid
		addi t1, t1, -1
		
		li s9, 4
		beq t0, t1, Generate_board		# IF the player is at the far right, dont move
		li s9, 0


		la t0, character
		lbu t0, 1(t0)					# The y-coordinate of character

		la t1, box
		lbu t1, 1(t1)					# Get the y-coordinate of the box

		bne t0, t1, continue_right
		
		# Check if box and character have similar x-coordinate after player moved left
		la t0, character
		lbu t0, 0(t0)					# The x-coordinate of the character
		addi t0, t0, 1
	
		la t1, box
		lbu t1, 0(t1)					# The x-coordinate of box
			
		bne t0, t1, continue_right		# If the player is not in the same location as 
										# the box after movement, the box cannot be moved
			
		la t2, gridsize					# Load the number of columns gridsize	
		lbu t2, 1(t2)
		addi t2, t2, -2

		li s9, 8						# Record that the box cannot be moved right
		beq t1, t2, Generate_board		#If the box is at the far right of board,
		li s9, 0						# it cannot be moved to the right further

	
		la t0, box
		lbu t1, 0(t0)
		addi t1, t1, 1					# Move the box right by one position
		sb t1, 0(t0)
			
		la t0, target					# Get the x-coordinate of the target
		lbu t0, 0(t0)	

		bne t0, t1, continue_right
			
		la t0, target					# Get the y-coordinate of the target
		lbu t0, 1(t0)	

		la t1, box						# Get the y-coordinate of the box
		lbu t1, 1(t1)

		bne t0, t1, continue_right
			
		li a7, 4
		la a0, congrats
		ecall

		addi s11, s11, 1
		
		j start_game

		continue_right:

			la t0, character
			lbu t1, 0(t0)				# The x-coordinate of the character
			addi t1, t1, 1
			sb t1, 0(t0)

			j Generate_board



	not_up:
		li a7, 4
		la a0, not_moved_up
		ecall
		j ask_input


	not_down:
		li a7, 4
		la a0, not_moved_down
		ecall
		j ask_input

	not_left:
		li a7, 4
		la a0, not_moved_left
		ecall
		j ask_input

	
	not_box_up:
		li a7, 4
		la a0, box_not_up
		ecall
		j ask_input

	not_box_down:
		li a7, 4
		la a0, box_not_down
		ecall
		j ask_input

	not_box_left:
		li a7, 4
		la a0, box_not_left
		ecall
		j ask_input

	not_box_right:
		li a7, 4
		la a0, box_not_right
		ecall
		j ask_input

	not_right:
		li a7, 4
		la a0, not_moved_right
		ecall
		j ask_input


store_number_of_moves:						# Function for Mulptiplayer game enhancement

		mv t0, sp
		add t0, t0, a0
		sb a2, 0(t0)

		li t0, 1
		bne t0, a0, not_first_player						# If the first player's move end,
		mv a5, a2							# write the moves of the first player
											# as score to beat
		j after_stored
		
		
		not_first_player:
		bge a2, a5, after_stored			# If the score to beat is smaller
											# Than the number of moves for current player,
		mv a5, a2							# don't update the Score to beat.

		j after_stored
		

leaderboard:						#Function for Mulptiplayer game enhancement
		la s0, players
		addi s0, s0, 3     		 	# Add 3 to t0 to ensure rounding up
		andi s0, s0, 0xFFFFFFFC 	# This ensures that the address of "players"
				
		lw t0, 0(s0)				# is aligned to 4
		lw s0, 0(s0)				# Get the number of players
		addi s0, s0, 1

		mv s1, sp

		li t1, -1		
		mul t0, t0, t1				# Allocate space on stack, to keep track of player
		add sp, sp, t0				# numbers
		addi sp, sp, -4				
		addi sp, sp, 3				
		andi sp, sp, 0xFFFFFFFC
		addi sp, sp, -1		
			
		li s2, 1			# counter
		
		add_numbers:
			mv t0, sp
			add t0, t0, s2
			
			sb s2, 0(t0)
			
			addi s2, s2, 1
			blt s2, s0, add_numbers

		la a0, newline
		li a7, 4
		ecall


		sort:
		
    		mv t0, s0            # Number of elements to sort
    		li t1, 1            # Outer loop index (i), starts from 1
    
		outer_loop:
    		bge t1, t0, finish     # If i >= n, end sorting
    		addi t2, t1, 1      # Inner loop index (j = i + 1)
    
		inner_loop:
    		bge t2, t0, outer_end  # If j >= n, move to the next pass of outer loop

    		# Load byte elements sp[i] and sp[j] to compare
 		    add  t3, s1, t1     # Address of sp[i], starting from index 1
  		    lbu   t5, 0(t3)      # t5 = sp[i]
  	  
  			add  t4, s1, t2     # Address of sp[j], starting from index 1
   			lbu   t6, 0(t4)      # t6 = sp[j]
    
   			 # Compare elements
   			ble t5, t6, skip_swap # If sp[i] <= sp[j], skip the swap

			add  a3, sp, t1     # Address of sp[i], starting from index 1
  		    lbu   a5, 0(a3)      # t5 = sp[i]
  	  
  			add  a4, sp, t2     # Address of sp[j], starting from index 1
   			lbu   a6, 0(a4)     


  			 # Swap sp[i] and sp[j]
  			 sb  t5, 0(t4)      # sp[j] = sp[i]
   			 sb  t6, 0(t3)      # sp[i] = sp[j]

			 sb a5, 0(a4)			
			 sb a6, 0(a3)

		skip_swap:
 			  addi t2, t2, 1      # j++
    		  j inner_loop        # Repeat inner loop
    
		outer_end:
 			  addi t1, t1, 1      # i++
  			  j outer_loop        # Repeat outer loop

		finish:


		li a7, 4
		la a0, dnewline
		ecall

		li a7, 4
		la a0, equal_lines
		ecall
		
		li a7, 4
		la a0, leaderboard_message
		ecall


		li s2, 1					#counter		

		print_leader_board:
	
			mv a0, s2			
			li a7, 1				# the the numbers 1, 2, 3, ....
			ecall
			
			la a0, player_ranking	# Print the word player
			li a7, 4
			ecall
			
			mv t0, sp
			add t0, t0,	s2			# store the number of each players
			lbu t0, 0(t0)

			mv a0, t0
			li a7, 1
			ecall
			
			la a0, dblank
			li a7, 4				# Prints Space
			ecall
			
			mv t0, s1
			add t0, t0,	s2			# Store the number of moves for 
			lbu t0, 0(t0)			# each player in t0. The number of 
									# moves are in ascending order

			mv a0, t0
			li a7, 1				# Print the score for the player
			ecall
			
			la a0, newline			# Prints newline character
			li a7, 4
			ecall

			addi s2, s2, 1			
			blt s2, s0, print_leader_board			

		li a7, 4
		la a0, newline
		ecall
		
		li a7, 4
		la a0, equal_lines
		ecall

	mv sp, a1

	li a7, 4
	la a0, restart_game
	ecall
	
	li a7, 5
	ecall
	
	li t1, 5
	beq a0, t1, _start

	li a7, 4
	la a0, dnewline
	ecall

    # TODO: That's the base game! Now, pick a pair of enhancements and
    # consider how to implement them.
	
exit:
	
	li a7, 4
	la a0, thank_you
	ecall

    li a7, 10
    ecall
    
    
# --- HELPER FUNCTIONS ---
# Feel free to use, modify, or add to them however you see fit.
     



	store_byte:
		la t0, values			
		lbu t1, 0(t0)
								# store the address of values in t0
		sb t1, 1(sp)			# store the first value in sp

		addi t0, t0, 1
		lbu t1, 0(t0)
		
		sb t1, 2(sp)			# store the second value in sp
		addi t0, t0, 1
		lbu t1, 0(t0)
		sb t1, 3(sp)			# store the third value in sp
		addi t0, t0, 1
		lbu t1, 0(t0)
		sb t1, 4(sp)			# store the fourth value in sp

		addi sp, sp, 4			# increment to next 4 bytes
		li s2, 0				# set the index of value to 0

		li t0, 1
		beq s3, t0, continue_loop				# continue the loop
		li t0, 2
		beq s3, t0, continue_newline

		
	insert_character:

		la t0, character_symbol				# store "@" in t0
		lbu t0, 0(t0)			
		
		la t1, values
		add t1, t1, s2			
		
		sb t0, 0(t1)			#store "@" to the ith position of values
		addi s2, s2, 1			# increment the index of values
		
		j next
	
	insert_target:

		la t0, target_symbol				# store "X" in t0
		lbu t0, 0(t0)			
		
		la t1, values
		add t1, t1, s2			
		
		sb t0, 0(t1)			#store "#" to the ith position of values
		addi s2, s2, 1			# increment the index of values
		
		j next
	
	insert_box:
		la t0, box_symbol			# store "box symbol" in t0
		lbu t0, 0(t0)			
		
		la t1, values
		add t1, t1, s2			
		
		sb t0, 0(t1)			#store "#" to the ith position of values
		addi s2, s2, 1			# increment the index of values
		
		j next

	insert_wall:
		la t0, wall_symbol			# store "box symbol" in t0
		lbu t0, 0(t0)			
		
		la t1, values
		add t1, t1, s2			
		
		sb t0, 0(t1)			#store "#" to the ith position of values
		addi s2, s2, 1			# increment the index of values
		
		j next		


		
	Add_null:
		la t1, values
		add t1, t1, s2

		sb x0, 0(t1)


		la t0, values			
		lbu t1, 0(t0)
								# store the address of values in t0
		sb t1, 1(sp)			# store the first value in sp

		addi t0, t0, 1
		lbu t1, 0(t0)

		sb t1, 2(sp)			# store the second value in sp
		addi t0, t0, 1
		lbu t1, 0(t0)
		sb t1, 3(sp)			# store the third value in sp
		addi t0, t0, 1
		lbu t1, 0(t0)
		sb t1, 4(sp)			# store the fourth value in sp
		
		j end
		

	add_newline:
		li t1, 4					# See if 4 bytes have been stored in value already
		li s3, 2
		beq t1, s2, store_byte		# If yes store them on stack
		continue_newline:


		la t1, values			#store the ith element of values
		add t1, t1, s2
		
		la t0, newline			
		lbu t0, 0(t0)			# load 

		sb t0, 0(t1)
		addi s2, s2, 1

		addi s1, s1, 1
 
		
		j loop


	end: 

		li t0, 1
		beq t0, s8, store_board
		
		mv sp, s4
		addi sp, sp, -1		

		mv a0, s4
		li a7, 4
		ecall

		mv sp, a1
		
		li t0, 2
		beq t0, s8, enter_input



switch_to_target:
	la t0, character
	la t1, target

	lb t2, 1(t1)		# Store the y coordinate of target in t2
	sb t2, 1(t0)

	lb t2, 0(t1)		# Store the x coordinate of target in t2
	sb t2, 0(t0)
	
	
	j Generate_board

win_game:
	li a7, 4
	la a0, newline
	ecall

	li a7, 4
	la a0, congrats
	ecall
			
	addi s11, s11, 1		# Mark that this player has finished playing the game	

	addi a2, a2, -1			# Decrement the move since the player
							# Didnt move but used cheat code
	j start_game





# Arguments: an integer MAX in a0
# Return: A number from 0 (inclusive) to MAX (exclusive)
random_function:
	addi sp, sp, -4
	addi sp, sp, 3				
	andi sp, sp, 0xFFFFFFFC
	addi sp, sp, -1		

	sw s1, 1(sp)

	mv s1, a0				# m = a2, where a2 is the value for modulus

    # Get the current time in milliseconds using syscall number 30
    li a7, 30               # Syscall number for getting the current time
    ecall                   # Make the syscall

	la t0, seed
    sw a0, 0(t0)              # Store the current time as the value for seed
   
    lw t0, 0(t0)              # t0 = value stored in seed

	li t3, 16777216 	   # Take modulus of seed with respect to t3	
	remu t0, t0, t3		   # To avoid overflow when multiplying by 31

    					# Linear Congruence formula: ((seed * a) + c) % m 
    li t1, 103           # Multiplier a
    li t2, 47        	# Increment c

	# Chosing that values 45 and 17, since we need to generate a number
	# between 0 and 255
	
    mul t0, t0, t1      # t0 = seed * a ((seed%(2^27)) * multiplier)
    add t0, t0, t2      # t0 = ((seed * a) + c)

    # Modulus operation to keep the value in 32-bit range
    

    rem t0, t0, s1           # t0 = (a * seed + c) % m
	mv a0, t0

	lw s1, 1(sp)
	addi sp, sp, 4
	jalr x0, 0(ra)