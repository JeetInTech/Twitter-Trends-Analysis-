<?php 
session_start();

	include("connection.php");
	include("functions.php");


	if($_SERVER['REQUEST_METHOD'] == "POST")
	{
		//something was posted
		$user_name = $_POST['user_name'];
		$password = $_POST['password'];
		$email = $_POST['email'];

		if(!empty($user_name) && !empty($password)  && !empty($email) && !is_numeric($user_name))
		{

			//save to database
			$user_id = random_num(20);
			$query = "insert into users (user_id,user_name,email,password) values ('$user_id','$user_name','$email','$password')";

			mysqli_query($con, $query);

			header("Location: login.php");
			die;
		}else
		{
			echo "Please enter some valid information!";
		}
	}
?>



<!DOCTYPE html>
<html lang="en">
<head>
    
    <title>Register Page</title>

    <link rel="stylesheet" href="form.css">

</head>
<body>
	
<form method="post">         
    <div class="alert-box"> 
        <p class="alert"></p>
    </div>

    <div class="form">
        <h1 class="heading"><a href="index.html">Register</a></h1>
        <input type="text" placeholder="name" autocomplete="off"  autocapitalize="none" class="name" name="user_name" required>
        <input type="text" placeholder="email" autocomplete="off"  autocapitalize="none" var emailPattern=/^[^\s@]+@[^\s@]+\.[^\s@]+$/ class="email" name="email" required>
        <input type="password" placeholder="password" autocomplete="off" class="password" name="password" required>

        <button class="submit-btn">register</button><br>   
        <a href="login.php" class="link">already have an account ? log in here</a>
    </div>
</form>
    <script src="form.js"></script>
    
</body>
</html>

     