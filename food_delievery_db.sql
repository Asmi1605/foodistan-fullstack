-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 05, 2022 at 11:13 AM
-- Server version: 10.4.24-MariaDB
-- PHP Version: 8.1.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `food_delievery_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `id` int(100) NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `email` varchar(120) NOT NULL,
  `phone` varchar(100) NOT NULL,
  `gender` varchar(50) NOT NULL,
  `password` varchar(120) NOT NULL,
  `status` varchar(40) NOT NULL DEFAULT 'pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`id`, `full_name`, `email`, `phone`, `gender`, `password`, `status`) VALUES
(1, 'prince sharma', 'ps884753@gmail.com', '010101044', 'Male', '123', 'active'),
(2, 'Raghav Mago', 'rgmago@gmail.com', '85899911111', 'Male', 'Hello123@', 'active'),
(8, 'Manish kumar', 'mnkumar@gmail.com', '9988998899', 'Male', 'Hello123@', 'active'),
(9, 'Ankush Kumar Mehra', 'akmehra345@gmail.com', '4455334455', 'Male', 'Hello123@', 'active'),
(10, 'Navjot Singh', 'nvsingh@gmail.com', '4466778822', 'Male', 'Hello123@', 'active'),
(11, 'ganja', 'ganja@gmail.com', '665544332211', 'Male', 'Hello123@', 'active'),
(12, 'Pinchu singh', 'pinchu@gmail.com', '3300990099', 'Male', 'Hello123@', 'active');

-- --------------------------------------------------------

--
-- Table structure for table `admin_queries`
--

CREATE TABLE `admin_queries` (
  `query_no` int(11) NOT NULL,
  `admin_phone` varchar(100) NOT NULL,
  `admin_name` varchar(100) NOT NULL,
  `query` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `admin_queries`
--

INSERT INTO `admin_queries` (`query_no`, `admin_phone`, `admin_name`, `query`) VALUES
(1, '010101044', 'prince sharma', 'Lorem ipsum, dolor sit amet Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dolorem saepe molestiae perspiciatis rem, deleniti minima illo! Architecto dicta adipisci quia similique ipsum obcaecati quam quo illo quisquam sapiente nemo dolorem odio perferendis delectus ad atque suscipit quos fuga sed exercitationem neque aliquid, impedit magni. Ut, accusantium, modi impedit rerum sit animi recusandae mollitia cum praesentium vel facilis sapiente voluptatibus dicta. Quisquam dolore officia blanditiis dolor nisi modi similique adipisci quae fugiat libero consectetur vel, sed ratione aspernatur autem explicabo cum!consectetur adipisicing elit. Dolorem saepe molestiae perspiciatis rem, deleniti minima illo! Architecto dicta adipisci quia similique ipsum obcaecati quam quo illo quisquam sapiente nemo dolorem odio perferendis delectus ad atque suscipit quos fuga sed exercitationem neque aliquid, impedit magni. Ut, accusantium, modi impedit rerum sit animi recusandae mollitia cum praesentium vel facilis sapiente voluptatibus dicta. Quisquam dolore officia blanditiis dolor nisi modi similique adipisci quae fugiat libero consectetur vel, sed ratione aspernatur autem explicabo cum!');

-- --------------------------------------------------------

--
-- Table structure for table `admin_restaurant`
--

CREATE TABLE `admin_restaurant` (
  `r_id` int(100) NOT NULL,
  `resphoto` text NOT NULL,
  `resname` varchar(100) NOT NULL,
  `resaddress` varchar(200) NOT NULL,
  `reslandmark` varchar(100) NOT NULL,
  `rescity` varchar(100) NOT NULL,
  `adminphone` varchar(100) NOT NULL,
  `res_status` varchar(50) NOT NULL DEFAULT 'pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `admin_restaurant`
--

INSERT INTO `admin_restaurant` (`r_id`, `resphoto`, `resname`, `resaddress`, `reslandmark`, `rescity`, `adminphone`, `res_status`) VALUES
(10, 'res_images/2.png', 'KFC Restaurant ', 'Ranjeet Avenue ,B- Block , near District Courts', 'Ranjeet Avenue', 'Amritsar', '010101044', 'active'),
(11, 'res_images/res22.jpg', 'Indian Palace Restaurant', 'i.d.h Market, Near Bus Stand ASR', 'Bus Stand', 'Amritsar', '85899911111', 'active'),
(12, 'res_images/res3.jpg', 'Kesar da Dhaba', 'Chowk passian , gali rajpura , near telephone exchange', 'Telephone Exchange', 'Amritsar', '9988998899', 'active'),
(13, 'res_images/res4.jpg', 'Bharawan da Dhaba', 'near town Hall , katra ahluwalia , near Golden Temple', 'Town Hall', 'Amritsar', '4455334455', 'active'),
(14, 'res_images/res5.jpg', 'Hoppers', 'SCO 15, 97 Acre Scheme, D-Block , Ranjit Avenue', 'Ranjeet Avenue', 'Amritsar', '4466778822', 'active');

-- --------------------------------------------------------

--
-- Table structure for table `bill`
--

CREATE TABLE `bill` (
  `bill_id` int(11) NOT NULL,
  `grandTotal` int(50) NOT NULL,
  `Date` date NOT NULL,
  `Time` time NOT NULL,
  `payment_Method` varchar(20) NOT NULL,
  `user_Id` int(11) NOT NULL,
  `full_address` text NOT NULL,
  `city` varchar(100) NOT NULL,
  `state` varchar(100) NOT NULL,
  `address_remarks` text NOT NULL,
  `status` varchar(100) NOT NULL DEFAULT 'Informed Restaurant About Your Order',
  `received_By` varchar(50) DEFAULT NULL,
  `paid_to_restaurant` varchar(30) NOT NULL DEFAULT 'No',
  `user_mobile` varchar(100) NOT NULL,
  `rider_id` int(100) DEFAULT NULL,
  `rider_name` varchar(100) DEFAULT NULL,
  `rider_mobile` varchar(100) DEFAULT NULL,
  `rider_gender` varchar(100) NOT NULL DEFAULT 'No'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `bill_details`
--

CREATE TABLE `bill_details` (
  `bd_id` int(11) NOT NULL,
  `bill_id` int(11) NOT NULL,
  `food_id` int(11) NOT NULL,
  `r_id` int(11) NOT NULL,
  `status` varchar(50) NOT NULL DEFAULT 'Informed Restaurant',
  `status_for_admin` varchar(100) NOT NULL DEFAULT 'Pending',
  `quantity` int(3) NOT NULL,
  `food_price` int(11) NOT NULL,
  `total_price` int(11) NOT NULL,
  `payment_received` varchar(50) NOT NULL DEFAULT 'No',
  `rider_number` varchar(100) DEFAULT NULL,
  `rider_name` varchar(100) DEFAULT NULL,
  `rider_gender` varchar(100) DEFAULT NULL,
  `profitt` int(200) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `customers_queries`
--

CREATE TABLE `customers_queries` (
  `query_id` int(11) NOT NULL,
  `user_phone` varchar(200) NOT NULL,
  `user_name` varchar(200) NOT NULL,
  `query` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `delieveryrider`
--

CREATE TABLE `delieveryrider` (
  `Rider_id` int(50) NOT NULL,
  `Name` varchar(100) NOT NULL,
  `Age` varchar(10) NOT NULL,
  `gender` varchar(30) NOT NULL,
  `gmail` varchar(100) NOT NULL,
  `phone` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  `status` varchar(100) NOT NULL DEFAULT 'Active',
  `address` text NOT NULL,
  `DL_Today` int(100) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `delieveryrider`
--

INSERT INTO `delieveryrider` (`Rider_id`, `Name`, `Age`, `gender`, `gmail`, `phone`, `password`, `status`, `address`, `DL_Today`) VALUES
(1, 'Deepak', '22', 'Male', 'deepak564@gmail.com', '1122334455', 'deepak', 'Attending Delievery', 'mahindra colony, gali no.3 , amritsar', 2),
(2, 'Preeti', '18', 'Female', 'preeti123@gmail.com', '8899889988', 'preeti', 'Attending Delievery', 'preet nagar , cowk paasan , near golden aveneue , amritsar', 0),
(3, 'Rahul', '18', 'Male', 'rahul778@gmail.com', '3344334430', 'rahul', 'Active', 'Rahul nagar , gali no.5 , amristar', 0),
(4, 'Ashish', '24', 'Male', 'ashish@gmail.com', '4477447744', 'ashish', 'Active', 'ashish nagar ,  gali no. 6 , amristar', 0),
(5, 'Gaurav', '21', 'Male', 'gaurav455@gmail.com', '1100110011', 'gaurav', 'Active', 'gaurav nagar ,  gali no.10 , amristar', 0),
(6, 'Kajol', '18', 'Female', 'kajol@gmail.com', '4422442241', 'kajol', 'Active', 'kajol nagar ,  gali no. 30 , Amristar', 0),
(7, 'Digambar', '22', 'Male', 'digambar@gmail.com', '8822882288', 'digambar', 'Active', 'digambar nagar', 0),
(8, 'Md rafi', '26', 'Male', 'mdrafi@gmail.com', '6633663362', 'mdrafi', 'Active', 'rafi nagar ,  gali no. 15 , Amritsar', 0);

-- --------------------------------------------------------

--
-- Table structure for table `food`
--

CREATE TABLE `food` (
  `id` int(11) NOT NULL,
  `food_name` varchar(120) NOT NULL,
  `food_description` varchar(500) NOT NULL,
  `cover_image` text NOT NULL,
  `actual_price` int(100) NOT NULL,
  `category` varchar(50) NOT NULL,
  `subcategory` varchar(100) NOT NULL,
  `r_id` int(120) NOT NULL,
  `restaurant_phone` varchar(30) NOT NULL,
  `price` int(100) NOT NULL,
  `discount` int(50) NOT NULL,
  `profit` int(100) NOT NULL,
  `main_price_for_profit` int(30) NOT NULL,
  `discount_to_be_shown` int(30) NOT NULL,
  `total_discount_for_customer` int(30) NOT NULL,
  `status` varchar(30) NOT NULL DEFAULT 'show'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `food`
--

INSERT INTO `food` (`id`, `food_name`, `food_description`, `cover_image`, `actual_price`, `category`, `subcategory`, `r_id`, `restaurant_phone`, `price`, `discount`, `profit`, `main_price_for_profit`, `discount_to_be_shown`, `total_discount_for_customer`, `status`) VALUES
(19, 'Plain Dosa', 'Its south indian delicious dish made of rice and served with chutney and sambur', 'food_image/plain dosa.jpg', 3, 'Veg', 'Breakfast', 10, '010101044', 21, 50, 18, 36, 42, 15, 'show'),
(20, 'Andhra Non-veg Meals', 'Andhras Special combo of dishes special for lunch', 'food_image/andhra non veg meals.jpg', 60, 'Nonveg', 'Lunch', 10, '010101044', 420, 50, 360, 720, 42, 300, 'show'),
(21, 'Mushroom Hot dog', 'A Healthy Snack With Awesome Taste', 'food_image/mushroom hot dog.jpg', 30, 'Veg', 'Evening Snacks', 10, '010101044', 60, 100, 30, 360, 83, 300, 'show'),
(22, 'Subz Paneer Pulao', 'The tasty Pulao made with Special Masalas and asmati Rice with subz', 'food_image/subz panner pulao.jpg', 140, 'Veg', 'Dinner', 10, '010101044', 560, 80, 420, 1680, 67, 1120, 'show'),
(23, 'Chicken krisper Burger with cheese', 'Tasty , healthy and Delicious Burger\r\n(Pack of 2)', 'food_image/chieck krisper with cheese.jpg', 70, 'Nonveg', 'Burgers and Beverages', 10, '010101044', 280, 80, 210, 840, 67, 560, 'show'),
(24, 'Red Bull Can', 'The powerful drink which will make you refreshing', 'food_image/red bull can.jpg', 30, 'Veg', 'Burgers and Beverages', 10, '010101044', 60, 100, 30, 360, 83, 300, 'show'),
(25, 'Plain pizza', 'Plain pizza made of light masalas and cheese', 'food_image/plain pizza.jpg', 25, 'Veg', 'Pizzanians', 10, '010101044', 75, 90, 50, 300, 75, 225, 'show'),
(26, 'Stawberry Sour Cream Coffee Cake', 'Cake Made of Stawberry. It\'s Smooth, light weight and Tasty cake which will give you a sour as well as sugary taste', 'food_image/stawberry sour cream coffee Cake.jpg', 28, 'Veg', 'Desserts', 10, '010101044', 112, 80, 84, 336, 67, 224, 'show'),
(27, '6pc Hot and Crispy Chicken Strips', 'Yummy and tasty chicken Leg Piece Bucket with saurces', 'food_image/6pc Hot and crispy chicken strips.jpg', 180, 'Nonveg', 'Chick and Chicken', 10, '010101044', 450, 95, 270, 2160, 79, 1710, 'show'),
(28, '5pc Leg Piece Bucket Meal', 'Yummy and Tasty Leg Pieces served with saurces', 'food_image/5pc leg piece buket meal.jpg', 250, 'Nonveg', 'Chick and Chicken', 10, '010101044', 500, 100, 250, 3000, 83, 2500, 'show'),
(29, '10Pc Leg Piece Bucket Meal', 'Yummy and Tasty Leg Pieces served with saurces', 'food_image/10pc leg piece bucet and 4 dips image.jpg', 380, 'Nonveg', 'Chick and Chicken', 10, '010101044', 760, 100, 380, 4560, 83, 3800, 'show'),
(30, '4Pc Hot and Crispy Chicken Strips', 'Yummy and Tasty Leg Pieces served with saurces', 'food_image/4pc Hot and crispy chicken strips.jpg', 200, 'Nonveg', 'Chick and Chicken', 10, '010101044', 400, 100, 200, 2400, 83, 2000, 'show'),
(31, 'Poori', 'Indian Traditional dish served with chana(chickpeace)', 'food_image/poori.jpg', 20, 'Veg', 'Breakfast', 11, '85899911111', 40, 100, 20, 240, 83, 200, 'show'),
(32, 'Andhra Egg Meal', 'Andhra\'s Special egg Dish very delicious in taste and rich in minerals', 'food_image/andhra egg meals.jpg', 25, 'Nonveg', 'Lunch', 11, '85899911111', 50, 100, 25, 300, 83, 250, 'show'),
(33, 'Cheese Sandwich', 'A tasty sandwich made with masalas with fillings and cheese', 'food_image/cheese sandwich.jpg', 35, 'Veg', 'Evening Snacks', 11, '85899911111', 105, 90, 70, 420, 75, 315, 'show'),
(34, 'Cheemen (Shrimp) Pulao', 'A sea food dish very tasty in taste', 'food_image/shrimp pulao.jpg', 60, 'Nonveg', 'Dinner', 11, '85899911111', 180, 90, 120, 720, 75, 540, 'show'),
(35, 'Mixed Zinger Doubles (2)', 'The double patty and double layer Burger', 'food_image/mixed zinger doubles.jpg', 100, 'Nonveg', 'Burgers and Beverages', 11, '85899911111', 250, 95, 150, 1200, 79, 950, 'show'),
(36, '7up Can 330ml', 'a refreshing Drink', 'food_image/7up 330ml.jpg', 20, 'Veg', 'Burgers and Beverages', 11, '85899911111', 40, 100, 20, 240, 83, 200, 'show'),
(37, 'Masala Pizza', 'The masala pizza made of delicious spicy Indian Masalas', 'food_image/masala pizza.jpg', 75, 'Veg', 'Burgers and Beverages', 11, '85899911111', 150, 100, 75, 900, 83, 750, 'show'),
(38, 'Vanila Ice Cream', 'A Sweet , healthy and Refrehsing ice cream mad ewith flavous of vanila', 'food_image/vanila icecream.jpg', 25, 'Veg', 'Desserts', 11, '85899911111', 100, 80, 75, 300, 67, 200, 'show'),
(39, 'Masala Dosa', 'A south Indian dish Made of Styuffing inside of potataoes served with nariyal chatni and sambur', 'food_image/masala dosa.jpg', 20, 'Veg', 'Breakfast', 12, '9988998899', 40, 100, 20, 240, 83, 200, 'show'),
(40, 'Veg Thali', 'a typical indian Lunch Thali full of indian dishes and Paranthas', 'food_image/veg thali.jpg', 130, 'Veg', 'Lunch', 12, '9988998899', 390, 90, 260, 1560, 75, 1170, 'show'),
(41, 'Twister', 'A Potatao twister served with myonese soruce and masalas sprinkles on it', 'food_image/twister.jpg', 35, 'Veg', 'Evening Snacks', 12, '9988998899', 70, 100, 35, 420, 83, 350, 'show'),
(42, 'Kathal Pulao', 'A pulao made of Kathal which is a lookalike non veg dish.basically if vegetarians wnats to taste how non veg tastes like.. they can try eating kathal', 'food_image/kathal pulao.jpg', 38, 'Veg', 'Dinner', 12, '9988998899', 190, 70, 152, 456, 58, 266, 'show'),
(43, '2 Chicekn Krisper Burgers', 'A typical indianstyle Chicekn Burger ', 'food_image/chicekn krisper burger.jpg', 120, 'Nonveg', 'Burgers and Beverages', 12, '9988998899', 240, 100, 120, 1440, 83, 1200, 'show'),
(44, 'Chicken Pizza', 'The Chicken Pizza made with chicken to[[ings along with all other usual toppings', 'food_image/chieckn pizza.jpg', 70, 'Nonveg', 'Pizzanians', 12, '9988998899', 350, 70, 280, 840, 58, 490, 'show'),
(45, 'Caramel Pecan Cheesecake', 'The Cake made of rich caramel ', 'food_image/caramel pecan cheesecake.jpg', 40, 'Veg', 'Desserts', 12, '9988998899', 120, 90, 80, 480, 75, 360, 'show'),
(46, 'Stawberry Ice Cream', 'Tasty, Sweet and Rich in minerals Stawberry flavour Ice Cream', 'food_image/stawberry ice cream.jpg', 30, 'Veg', 'Desserts', 12, '9988998899', 120, 80, 90, 360, 67, 240, 'show'),
(47, 'Manglore Bhaji', 'This is a popular Manglorian Dish, Made of Rice flaur stuffed with filling of masalas and potatoes, a healthy breakfast', 'food_image/manglore bhaji.jpg', 12, 'Veg', 'Breakfast', 13, '4455334455', 48, 80, 36, 144, 67, 96, 'show'),
(48, 'Paneer Hotdog', 'A tasty Hotdog stuffed with paneer', 'food_image/paneer hot dog.jpg', 25, 'Veg', 'Evening Snacks', 13, '4455334455', 50, 100, 25, 300, 83, 250, 'show'),
(49, 'Veg Thali', 'a Veg Thali full of rich indian dishes', 'food_image/veg thali.jpg', 130, 'Veg', 'Lunch', 13, '4455334455', 520, 80, 390, 1560, 67, 1040, 'show'),
(50, 'Pepsi Pet', 'A Refreshing Drink', 'food_image/red bull can.jpg', 20, 'Veg', 'Burgers and Beverages', 13, '4455334455', 40, 100, 20, 240, 83, 200, 'show'),
(51, 'Corn pea Pizza', 'The Pizza is made of Corn and Pea along with other Traditional Toppings of pizza', 'food_image/corn pea pizza.jpg', 45, 'Veg', 'Pizzanians', 13, '4455334455', 180, 80, 135, 540, 67, 360, 'show'),
(52, 'Red Velvel Cheese Cake', 'The cake has a  Favour of Red Velvel and it\'s bread color is also red due to its flavour', 'food_image/red velvet cheesecakes.jpg', 45, 'Veg', 'Desserts', 13, '4455334455', 135, 90, 90, 540, 75, 405, 'show'),
(53, 'Andhra Veg Meals', 'Andra\'s Special veg Dishes Combo of Meals which are really healthy and delicious in taste', 'food_image/andhra veg meals.jpg', 50, 'Veg', 'Lunch', 14, '4466778822', 250, 70, 200, 600, 58, 350, 'show'),
(54, 'Samosa 4Pc', 'A typical indian Evening Snack made of filling of Potato and pea in it and deep friend in sunflower oil', 'food_image/samosa.jpg', 15, 'Veg', 'Evening Snacks', 14, '4466778822', 60, 80, 45, 180, 67, 120, 'show'),
(55, 'Mirinda ', 'Typical Refreshing Cold drink ', 'food_image/marinda can.jpg', 10, 'Veg', 'Burgers and Beverages', 14, '4466778822', 30, 90, 20, 120, 75, 90, 'show'),
(56, 'Vanilla Choclate Cupcake', 'A healthy, sweet and delicious CupCake having flavour and toppings of pure choclate', 'food_image/vanila cupcake.jpg', 40, 'Veg', 'Desserts', 14, '4466778822', 160, 80, 120, 480, 67, 320, 'show');

-- --------------------------------------------------------

--
-- Table structure for table `food_review`
--

CREATE TABLE `food_review` (
  `food_id` int(11) NOT NULL,
  `message` text NOT NULL,
  `username` varchar(100) NOT NULL,
  `userPhone` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `rider_review`
--

CREATE TABLE `rider_review` (
  `bill_id` int(11) NOT NULL,
  `rider_number` varchar(100) NOT NULL,
  `review` text NOT NULL,
  `user_number` varchar(100) NOT NULL,
  `user_name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `super_admin`
--

CREATE TABLE `super_admin` (
  `super_email` varchar(100) NOT NULL,
  `password` varchar(50) NOT NULL,
  `name` varchar(150) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `super_admin`
--

INSERT INTO `super_admin` (`super_email`, `password`, `name`) VALUES
('', '', ''),
('super@gmail.com', 'super', 'Ankush Mehra');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(100) NOT NULL,
  `user_email` varchar(50) NOT NULL,
  `user_mobile` varchar(15) NOT NULL,
  `user_password` varchar(50) NOT NULL,
  `uname` varchar(250) NOT NULL,
  `otp` int(11) NOT NULL,
  `user_address` text NOT NULL,
  `user_city` varchar(50) NOT NULL,
  `user_state` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `user_email`, `user_mobile`, `user_password`, `uname`, `otp`, `user_address`, `user_city`, `user_state`) VALUES
(4, 'p@s', '8847538103', '123', 'Prince Sharma', 0, 'abcd nagar', 'Amritsar', 'Punjab');

-- --------------------------------------------------------

--
-- Table structure for table `workrequest`
--

CREATE TABLE `workrequest` (
  `req_id` int(11) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(100) NOT NULL,
  `typeofwork` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `workrequest`
--

INSERT INTO `workrequest` (`req_id`, `email`, `phone`, `typeofwork`) VALUES
(1, 'Restaurant', 'baba123@gmail.com', '1122334455');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `phone` (`phone`);

--
-- Indexes for table `admin_queries`
--
ALTER TABLE `admin_queries`
  ADD PRIMARY KEY (`query_no`);

--
-- Indexes for table `admin_restaurant`
--
ALTER TABLE `admin_restaurant`
  ADD PRIMARY KEY (`r_id`);

--
-- Indexes for table `bill`
--
ALTER TABLE `bill`
  ADD PRIMARY KEY (`bill_id`),
  ADD KEY `user_Id` (`user_Id`);

--
-- Indexes for table `bill_details`
--
ALTER TABLE `bill_details`
  ADD PRIMARY KEY (`bd_id`),
  ADD KEY `bill_id` (`bill_id`),
  ADD KEY `food_id` (`food_id`),
  ADD KEY `r_id` (`r_id`);

--
-- Indexes for table `customers_queries`
--
ALTER TABLE `customers_queries`
  ADD PRIMARY KEY (`query_id`);

--
-- Indexes for table `delieveryrider`
--
ALTER TABLE `delieveryrider`
  ADD PRIMARY KEY (`Rider_id`),
  ADD UNIQUE KEY `gmail` (`gmail`,`phone`);

--
-- Indexes for table `food`
--
ALTER TABLE `food`
  ADD PRIMARY KEY (`id`),
  ADD KEY `r_id` (`r_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `user_email` (`user_email`),
  ADD UNIQUE KEY `user_mobile` (`user_mobile`);

--
-- Indexes for table `workrequest`
--
ALTER TABLE `workrequest`
  ADD PRIMARY KEY (`req_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `id` int(100) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `admin_queries`
--
ALTER TABLE `admin_queries`
  MODIFY `query_no` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `admin_restaurant`
--
ALTER TABLE `admin_restaurant`
  MODIFY `r_id` int(100) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `bill`
--
ALTER TABLE `bill`
  MODIFY `bill_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `bill_details`
--
ALTER TABLE `bill_details`
  MODIFY `bd_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `customers_queries`
--
ALTER TABLE `customers_queries`
  MODIFY `query_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `delieveryrider`
--
ALTER TABLE `delieveryrider`
  MODIFY `Rider_id` int(50) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `food`
--
ALTER TABLE `food`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=57;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(100) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `workrequest`
--
ALTER TABLE `workrequest`
  MODIFY `req_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `bill`
--
ALTER TABLE `bill`
  ADD CONSTRAINT `bill_ibfk_1` FOREIGN KEY (`user_Id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `bill_details`
--
ALTER TABLE `bill_details`
  ADD CONSTRAINT `bill_details_ibfk_1` FOREIGN KEY (`bill_id`) REFERENCES `bill` (`bill_id`),
  ADD CONSTRAINT `bill_details_ibfk_2` FOREIGN KEY (`food_id`) REFERENCES `food` (`id`),
  ADD CONSTRAINT `bill_details_ibfk_3` FOREIGN KEY (`r_id`) REFERENCES `admin_restaurant` (`r_id`);

--
-- Constraints for table `food`
--
ALTER TABLE `food`
  ADD CONSTRAINT `food_ibfk_1` FOREIGN KEY (`r_id`) REFERENCES `admin_restaurant` (`r_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
