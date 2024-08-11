<?php 

session_start();

	include("connection.php");
	include("functions.php");


	if($_SERVER['REQUEST_METHOD'] == "POST")
	{
		//something was posted
		$user_name = $_POST['user_name'];
		$password = $_POST['password'];

		if(!empty($user_name) && !empty($password) && !is_numeric($user_name))
		{

			//read from database
			$query = "select * from users where user_name = '$user_name' limit 1";
			$result = mysqli_query($con, $query);

			if($result)
			{
				if($result && mysqli_num_rows($result) > 0)
				{

					$user_data = mysqli_fetch_assoc($result);
					
					if($user_data['password'] === $password)
					{

						$_SESSION['user_id'] = $user_data['user_id'];
						header("Location: index.php");
						die;
					}
				}
			}
			
			echo "wrong username or password!";
		}else
		{
			echo "wrong username or password!";
		}
	}

?>


<!DOCTYPE html>
<html lang="en" >
<head>
  <meta charset="UTF-8">
  <title>Twit Login</title>
  <link rel='stylesheet' href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css'>
<link rel='stylesheet' href='https://fonts.googleapis.com/css2?family=Poppins&amp;display=swap'><link rel="stylesheet" href="login.css">
<link rel="stylesheet" href="styles.css">
</head>
<body>
<nav class="navbar">
      <div class="navbar__container">
        <a href="index.html" id="navbar__logo">Twitter Trends</a>
        <div class="navbar__toggle" id="mobile-menu">
          <span class="bar"></span> <span class="bar"></span>
          <span class="bar"></span>
        </div>
        <ul class="navbar__menu">
          <li class="navbar__item">
            <a href="index.html" class="navbar__links" id="home-page">Home</a>
          </li>
          <li class="navbar__item">
            <a href="about.html" class="navbar__links" id="about-page">About</a>
          <li class="navbar__btn">
            
            <a href="signup.php" class="button" id="signup">Register</a></li>
          </li>
        </ul>
      </div>
    </nav>
<!-- partial:index.partial.html -->
<br><br>
<form method="post">
<div class="wrapper">
  <div class="login_box">
    <div class="login-header">
      <span>Login</span>
    </div>
    
    <div class="input_box">
      
      <input type="text" id="user" class="input-field" name="user_name" required>
      <label for="user" class="label">Username</label>
      <i class="bx bx-user icon"></i>
    </div>

    <div class="input_box">
      
      <input type="password" id="pass" class="input-field" name="password" required>
      <label for="pass" class="label">Password</label>
      <i class="bx bx-lock-alt icon"></i>
    </div>

    <div class="remember-forgot">
      <div class="remember-me">
        <input type="checkbox" id="remember">
        <label for="remember">Remember me</label>
      </div>

      <div class="forgot">
        <a href="#">Forgot password?</a>
      </div>
    </div>

    <div class="input_box">
      
      <button><input type="submit" class="input-submit" value="Login"></button>
    </div>
<center>

  <a href="signup.php" class="link">don't have an account? Register one</a></center>

    </div>
  </div>
</div>
</form>
<!-- partial -->
<script src="app.js"></script>
</body>
</html>
