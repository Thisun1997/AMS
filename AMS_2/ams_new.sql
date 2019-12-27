-- phpMyAdmin SQL Dump
-- version 4.8.5
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 27, 2019 at 08:49 AM
-- Server version: 10.1.40-MariaDB
-- PHP Version: 7.3.5

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ams`
--

DELIMITER $$
--
-- Procedures
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `AddSheduleAndTrip` (IN `time_table_id` INT, IN `shedule_id` INT, IN `economy_p` DECIMAL(8,2), IN `business_p` DECIMAL(8,2), IN `platinum_p` DECIMAL(8,2))  NO SQL
BEGIN
	INSERT INTO time_table_shedule(time_table_id,shedule_id) VALUES (time_table_id,shedule_id);
    INSERT INTO trip(shedule_id,economy_price,business_price,platinum_price) VALUES (shedule_id,economy_p,business_p,platinum_p);
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `routeDetails` ()  BEGIN
  SELECT route_id,company_plane_code, dept.`code` AS x, dest.`code` AS y FROM airport AS dept, airport AS dest,plane NATURAL JOIN route WHERE dest.airport_id = route.dest_airport_id AND dept.airport_id = route.dept_airport_id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `search` (IN `dest_in` INT, IN `dept_in` INT, IN `date_in` DATE, IN `req_seat_in` INT)  NO SQL
BEGIN
SELECT `date`,trip_id,shedule_id,plane_type_id,company_plane_code,dept_time,arr_time,economy_price,available_economy_seats,platinum_price,available_platinum_seats,business_price,available_business_seats,dept.code AS dept_code,dept.city AS dept_city,dept.airport_id AS dept_id, dest.code AS dest_code,dest.airport_id AS dest_id,dest.city AS dest_city FROM airport AS dept, airport AS dest NATURAL JOIN trip_seats NATURAL JOIN shedule NATURAL JOIN route NATURAL JOIN time_table NATURAL JOIN time_table_shedule NATURAL JOIN trip NATURAL JOIN plane WHERE dest.airport_id = route.dest_airport_id AND dept.airport_id = route.dept_airport_id AND dest.airport_id=dest_in AND dept.airport_id=dept_in AND date = date_in AND available_economy_seats + available_platinum_seats + available_business_seats >= req_seat_in;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `SelectRoute` (IN `id` INT)  NO SQL
BEGIN
SELECT route_id,company_plane_code,dept.`code` AS x, dest.`code` AS y FROM airport AS dept, airport AS dest NATURAL JOIN route NATURAL JOIN plane WHERE dest.airport_id = route.dest_airport_id AND dept.airport_id = route.dept_airport_id AND route_id = id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `SheduleDate` (IN `date_in` DATE)  NO SQL
BEGIN       
SELECT trip_id,`date`,dept_time,arr_time,company_plane_code,economy_price,business_price,platinum_price,route_id,dept.code AS x, dest.code AS y FROM airport AS dept, airport AS dest NATURAL JOIN route NATURAL JOIN time_table NATURAL JOIN time_table_shedule NATURAL JOIN shedule NATURAL JOIN trip NATURAL JOIN plane NATURAL JOIN airport WHERE dest.airport_id = route.dest_airport_id AND dept.airport_id = route.dept_airport_id AND `date` = date_in;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `SheduleDetails` (IN `trip_id_in` INT)  NO SQL
BEGIN
SELECT `date`,dept_time,trip_id,arr_time,company_plane_code,shedule_id,economy_price,business_price,platinum_price,route_id,dept.code AS x, dest.code AS y FROM airport AS dept, airport AS dest NATURAL JOIN route NATURAL JOIN time_table NATURAL JOIN time_table_shedule NATURAL JOIN shedule NATURAL JOIN trip NATURAL JOIN plane NATURAL JOIN airport WHERE dest.airport_id = route.dest_airport_id AND dept.airport_id = route.dept_airport_id AND trip_id = trip_id_in;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `TotalSeats` (IN `id` INT)  NO SQL
BEGIN
SELECT tot_economy_seats,tot_business_seats,tot_platinum_seats FROM plane_type NATURAL JOIN route NATURAL JOIN plane WHERE route_id = id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `TripDetails` (IN `time_table_id_in` INT)  NO SQL
BEGIN       
SELECT delay_time,trip_id,`date`,dept_time,arr_time,company_plane_code,economy_price,business_price,platinum_price,route_id,dept.code AS x, dest.code AS y,tot_economy_passengers+tot_business_passengers+tot_platinum_passengers AS tot_no_passengers FROM airport AS dept, airport AS dest NATURAL JOIN route NATURAL JOIN time_table NATURAL JOIN time_table_shedule NATURAL JOIN shedule LEFT OUTER JOIN delay USING(delay_id) NATURAL JOIN trip NATURAL JOIN plane NATURAL JOIN airport WHERE dest.airport_id = route.dest_airport_id AND dept.airport_id = route.dept_airport_id AND time_table_id = time_table_id_in;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `airport`
--

CREATE TABLE `airport` (
  `airport_id` int(11) NOT NULL,
  `code` varchar(5) NOT NULL,
  `city` varchar(20) DEFAULT NULL,
  `state` varchar(20) DEFAULT NULL,
  `country` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `airport`
--

INSERT INTO `airport` (`airport_id`, `code`, `city`, `state`, `country`) VALUES
(1, 'BIK', 'Colombo', '', 'Sri Lanka'),
(2, 'HRI', 'Hambanthota', '', 'Sri Lanka'),
(3, 'Dongo', 'dongo', '', 'dhg');

-- --------------------------------------------------------

--
-- Table structure for table `delay`
--

CREATE TABLE `delay` (
  `delay_id` int(11) NOT NULL,
  `delay_time` time NOT NULL,
  `reason` varchar(40) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `guest_passenger`
--

CREATE TABLE `guest_passenger` (
  `passenger_id` int(11) NOT NULL,
  `email` varchar(40) NOT NULL,
  `full_name` varchar(40) NOT NULL,
  `date_of_birth` date NOT NULL,
  `gender` varchar(8) NOT NULL,
  `citizenship` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `guest_passenger`
--

INSERT INTO `guest_passenger` (`passenger_id`, `email`, `full_name`, `date_of_birth`, `gender`, `citizenship`) VALUES
(1, 'ss', 'guest1', '2019-03-07', 'male', 'ss'),
(2, 'aaaa', 'guest', '2019-12-04', 'male', 'aa'),
(3, 'hh', 'hh', '2019-12-05', 'male', 'hh'),
(4, 'aa', 'asd', '2019-12-12', 'male', 'aaa'),
(5, 'aakk@gmail.com', 'ghj', '2019-12-27', 'male', 'aaa'),
(6, 'dd@gmai.com', 'aaaa', '2019-12-12', 'male', 'dd'),
(7, 'aa@a.com', 'aa', '2019-12-03', 'male', 'aa'),
(8, 'fff@f.com', 'ghj', '2019-12-04', 'male', 'ghj'),
(9, 'aa@a.com', 'dfnks', '2019-12-13', 'male', 'aa'),
(10, 'k@gmail.com', 'Kamal', '2019-07-11', 'male', 'Sri lankan'),
(11, 'k@gmail.com', 'aa', '2019-12-06', 'male', 'aa'),
(12, 'a@gmail.com', 'ss', '2019-12-11', 'male', 'aa'),
(13, 's@s.com', 'aass', '2019-12-12', 'male', 's'),
(14, 'a@f.com', 'pp', '2019-12-12', 'male', 'aa');

-- --------------------------------------------------------

--
-- Table structure for table `member_passenger`
--

CREATE TABLE `member_passenger` (
  `passenger_id` int(11) NOT NULL,
  `category_id` int(11) DEFAULT NULL,
  `full_name` varchar(40) NOT NULL,
  `date_of_birth` date NOT NULL,
  `gender` varchar(8) NOT NULL,
  `citizenship` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `member_passenger`
--

INSERT INTO `member_passenger` (`passenger_id`, `category_id`, `full_name`, `date_of_birth`, `gender`, `citizenship`) VALUES
(2, NULL, 'member1', '2019-12-04', 'male', 'a'),
(3, NULL, 'member2', '2019-12-17', 'male', 'P'),
(4, NULL, 'member3', '2019-12-02', 'male', 'ss'),
(5, NULL, 'member4', '2019-03-01', 'male', 'g'),
(6, NULL, 'm5', '2019-06-06', 'male', 'cc'),
(7, NULL, 'm8', '2019-12-25', 'male', 'a'),
(9, NULL, 'member4', '2019-12-19', 'male', 'aa'),
(10, NULL, 'asd', '2019-12-12', 'male', 'ff'),
(11, NULL, 'aa``', '2019-12-10', 'female', 'aa'),
(12, NULL, 'asd', '2019-12-12', 'male', 'bb'),
(13, NULL, 'aa', '2019-12-11', 'male', 'aa'),
(14, NULL, 'dfg', '2019-12-12', 'male', 'ff');

-- --------------------------------------------------------

--
-- Table structure for table `passenger_category`
--

CREATE TABLE `passenger_category` (
  `category_id` int(11) NOT NULL,
  `category_name` varchar(10) NOT NULL,
  `No_of_reservations` int(11) DEFAULT NULL,
  `discount` decimal(4,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `passenger_category`
--

INSERT INTO `passenger_category` (`category_id`, `category_name`, `No_of_reservations`, `discount`) VALUES
(1, 'Gold', 103, '10.00'),
(2, 'Frequent', 110, '14.00');

-- --------------------------------------------------------

--
-- Table structure for table `plane`
--

CREATE TABLE `plane` (
  `plane_id` int(11) NOT NULL,
  `company_plane_code` varchar(5) NOT NULL,
  `plane_type_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `plane`
--

INSERT INTO `plane` (`plane_id`, `company_plane_code`, `plane_type_id`) VALUES
(2, 'BB43', 12),
(3, 'BB41', 12);

-- --------------------------------------------------------

--
-- Table structure for table `plane_type`
--

CREATE TABLE `plane_type` (
  `plane_type_id` int(11) NOT NULL,
  `plane_type` varchar(5) NOT NULL,
  `tot_economy_seats` int(11) DEFAULT NULL,
  `tot_business_seats` int(11) DEFAULT NULL,
  `tot_platinum_seats` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `plane_type`
--

INSERT INTO `plane_type` (`plane_type_id`, `plane_type`, `tot_economy_seats`, `tot_business_seats`, `tot_platinum_seats`) VALUES
(12, 'B324', 12, 4, 0),
(13, 'B453', 164, 40, 20);

-- --------------------------------------------------------

--
-- Table structure for table `regular_route_time`
--

CREATE TABLE `regular_route_time` (
  `route_id` int(11) NOT NULL,
  `dept_time` time NOT NULL,
  `arr_time` time NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `regular_route_time`
--

INSERT INTO `regular_route_time` (`route_id`, `dept_time`, `arr_time`) VALUES
(8, '01:02:00', '02:05:00');

-- --------------------------------------------------------

--
-- Table structure for table `reservation`
--

CREATE TABLE `reservation` (
  `reservation_id` int(11) NOT NULL,
  `passenger_id` int(11) NOT NULL,
  `trip_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `route`
--

CREATE TABLE `route` (
  `route_id` int(11) NOT NULL,
  `plane_id` int(11) NOT NULL,
  `dept_airport_id` int(11) NOT NULL,
  `dest_airport_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `route`
--

INSERT INTO `route` (`route_id`, `plane_id`, `dept_airport_id`, `dest_airport_id`) VALUES
(7, 2, 1, 1),
(8, 2, 2, 1),
(9, 2, 1, 2),
(10, 3, 1, 2);

-- --------------------------------------------------------

--
-- Table structure for table `seat`
--

CREATE TABLE `seat` (
  `seat_id` varchar(20) NOT NULL,
  `plane_type_id` int(11) DEFAULT NULL,
  `seat_type` varchar(15) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `seat`
--

INSERT INTO `seat` (`seat_id`, `plane_type_id`, `seat_type`) VALUES
('B324-B-A1', 12, 'business'),
('B324-B-B1', 12, 'business'),
('B324-B-C1', 12, 'business'),
('B324-B-D1', 12, 'business'),
('B324-E-A1', 12, 'economy'),
('B324-E-A2', 12, 'economy'),
('B324-E-A3', 12, 'economy'),
('B324-E-B1', 12, 'economy'),
('B324-E-B2', 12, 'economy'),
('B324-E-B3', 12, 'economy'),
('B324-E-C1', 12, 'economy'),
('B324-E-C2', 12, 'economy'),
('B324-E-C3', 12, 'economy'),
('B324-E-D1', 12, 'economy'),
('B324-E-D2', 12, 'economy'),
('B324-E-D3', 12, 'economy'),
('B453-B-A1', 13, 'business'),
('B453-B-A10', 13, 'business'),
('B453-B-A2', 13, 'business'),
('B453-B-A3', 13, 'business'),
('B453-B-A4', 13, 'business'),
('B453-B-A5', 13, 'business'),
('B453-B-A6', 13, 'business'),
('B453-B-A7', 13, 'business'),
('B453-B-A8', 13, 'business'),
('B453-B-A9', 13, 'business'),
('B453-B-B1', 13, 'business'),
('B453-B-B10', 13, 'business'),
('B453-B-B2', 13, 'business'),
('B453-B-B3', 13, 'business'),
('B453-B-B4', 13, 'business'),
('B453-B-B5', 13, 'business'),
('B453-B-B6', 13, 'business'),
('B453-B-B7', 13, 'business'),
('B453-B-B8', 13, 'business'),
('B453-B-B9', 13, 'business'),
('B453-B-C1', 13, 'business'),
('B453-B-C10', 13, 'business'),
('B453-B-C2', 13, 'business'),
('B453-B-C3', 13, 'business'),
('B453-B-C4', 13, 'business'),
('B453-B-C5', 13, 'business'),
('B453-B-C6', 13, 'business'),
('B453-B-C7', 13, 'business'),
('B453-B-C8', 13, 'business'),
('B453-B-C9', 13, 'business'),
('B453-B-D1', 13, 'business'),
('B453-B-D10', 13, 'business'),
('B453-B-D2', 13, 'business'),
('B453-B-D3', 13, 'business'),
('B453-B-D4', 13, 'business'),
('B453-B-D5', 13, 'business'),
('B453-B-D6', 13, 'business'),
('B453-B-D7', 13, 'business'),
('B453-B-D8', 13, 'business'),
('B453-B-D9', 13, 'business'),
('B453-E-A1', 13, 'economy'),
('B453-E-A10', 13, 'economy'),
('B453-E-A11', 13, 'economy'),
('B453-E-A12', 13, 'economy'),
('B453-E-A13', 13, 'economy'),
('B453-E-A14', 13, 'economy'),
('B453-E-A15', 13, 'economy'),
('B453-E-A16', 13, 'economy'),
('B453-E-A17', 13, 'economy'),
('B453-E-A18', 13, 'economy'),
('B453-E-A19', 13, 'economy'),
('B453-E-A2', 13, 'economy'),
('B453-E-A20', 13, 'economy'),
('B453-E-A21', 13, 'economy'),
('B453-E-A22', 13, 'economy'),
('B453-E-A23', 13, 'economy'),
('B453-E-A24', 13, 'economy'),
('B453-E-A25', 13, 'economy'),
('B453-E-A26', 13, 'economy'),
('B453-E-A27', 13, 'economy'),
('B453-E-A28', 13, 'economy'),
('B453-E-A29', 13, 'economy'),
('B453-E-A3', 13, 'economy'),
('B453-E-A30', 13, 'economy'),
('B453-E-A31', 13, 'economy'),
('B453-E-A32', 13, 'economy'),
('B453-E-A33', 13, 'economy'),
('B453-E-A34', 13, 'economy'),
('B453-E-A35', 13, 'economy'),
('B453-E-A36', 13, 'economy'),
('B453-E-A37', 13, 'economy'),
('B453-E-A38', 13, 'economy'),
('B453-E-A39', 13, 'economy'),
('B453-E-A4', 13, 'economy'),
('B453-E-A40', 13, 'economy'),
('B453-E-A41', 13, 'economy'),
('B453-E-A5', 13, 'economy'),
('B453-E-A6', 13, 'economy'),
('B453-E-A7', 13, 'economy'),
('B453-E-A8', 13, 'economy'),
('B453-E-A9', 13, 'economy'),
('B453-E-B1', 13, 'economy'),
('B453-E-B10', 13, 'economy'),
('B453-E-B11', 13, 'economy'),
('B453-E-B12', 13, 'economy'),
('B453-E-B13', 13, 'economy'),
('B453-E-B14', 13, 'economy'),
('B453-E-B15', 13, 'economy'),
('B453-E-B16', 13, 'economy'),
('B453-E-B17', 13, 'economy'),
('B453-E-B18', 13, 'economy'),
('B453-E-B19', 13, 'economy'),
('B453-E-B2', 13, 'economy'),
('B453-E-B20', 13, 'economy'),
('B453-E-B21', 13, 'economy'),
('B453-E-B22', 13, 'economy'),
('B453-E-B23', 13, 'economy'),
('B453-E-B24', 13, 'economy'),
('B453-E-B25', 13, 'economy'),
('B453-E-B26', 13, 'economy'),
('B453-E-B27', 13, 'economy'),
('B453-E-B28', 13, 'economy'),
('B453-E-B29', 13, 'economy'),
('B453-E-B3', 13, 'economy'),
('B453-E-B30', 13, 'economy'),
('B453-E-B31', 13, 'economy'),
('B453-E-B32', 13, 'economy'),
('B453-E-B33', 13, 'economy'),
('B453-E-B34', 13, 'economy'),
('B453-E-B35', 13, 'economy'),
('B453-E-B36', 13, 'economy'),
('B453-E-B37', 13, 'economy'),
('B453-E-B38', 13, 'economy'),
('B453-E-B39', 13, 'economy'),
('B453-E-B4', 13, 'economy'),
('B453-E-B40', 13, 'economy'),
('B453-E-B41', 13, 'economy'),
('B453-E-B5', 13, 'economy'),
('B453-E-B6', 13, 'economy'),
('B453-E-B7', 13, 'economy'),
('B453-E-B8', 13, 'economy'),
('B453-E-B9', 13, 'economy'),
('B453-E-C1', 13, 'economy'),
('B453-E-C10', 13, 'economy'),
('B453-E-C11', 13, 'economy'),
('B453-E-C12', 13, 'economy'),
('B453-E-C13', 13, 'economy'),
('B453-E-C14', 13, 'economy'),
('B453-E-C15', 13, 'economy'),
('B453-E-C16', 13, 'economy'),
('B453-E-C17', 13, 'economy'),
('B453-E-C18', 13, 'economy'),
('B453-E-C19', 13, 'economy'),
('B453-E-C2', 13, 'economy'),
('B453-E-C20', 13, 'economy'),
('B453-E-C21', 13, 'economy'),
('B453-E-C22', 13, 'economy'),
('B453-E-C23', 13, 'economy'),
('B453-E-C24', 13, 'economy'),
('B453-E-C25', 13, 'economy'),
('B453-E-C26', 13, 'economy'),
('B453-E-C27', 13, 'economy'),
('B453-E-C28', 13, 'economy'),
('B453-E-C29', 13, 'economy'),
('B453-E-C3', 13, 'economy'),
('B453-E-C30', 13, 'economy'),
('B453-E-C31', 13, 'economy'),
('B453-E-C32', 13, 'economy'),
('B453-E-C33', 13, 'economy'),
('B453-E-C34', 13, 'economy'),
('B453-E-C35', 13, 'economy'),
('B453-E-C36', 13, 'economy'),
('B453-E-C37', 13, 'economy'),
('B453-E-C38', 13, 'economy'),
('B453-E-C39', 13, 'economy'),
('B453-E-C4', 13, 'economy'),
('B453-E-C40', 13, 'economy'),
('B453-E-C41', 13, 'economy'),
('B453-E-C5', 13, 'economy'),
('B453-E-C6', 13, 'economy'),
('B453-E-C7', 13, 'economy'),
('B453-E-C8', 13, 'economy'),
('B453-E-C9', 13, 'economy'),
('B453-E-D1', 13, 'economy'),
('B453-E-D10', 13, 'economy'),
('B453-E-D11', 13, 'economy'),
('B453-E-D12', 13, 'economy'),
('B453-E-D13', 13, 'economy'),
('B453-E-D14', 13, 'economy'),
('B453-E-D15', 13, 'economy'),
('B453-E-D16', 13, 'economy'),
('B453-E-D17', 13, 'economy'),
('B453-E-D18', 13, 'economy'),
('B453-E-D19', 13, 'economy'),
('B453-E-D2', 13, 'economy'),
('B453-E-D20', 13, 'economy'),
('B453-E-D21', 13, 'economy'),
('B453-E-D22', 13, 'economy'),
('B453-E-D23', 13, 'economy'),
('B453-E-D24', 13, 'economy'),
('B453-E-D25', 13, 'economy'),
('B453-E-D26', 13, 'economy'),
('B453-E-D27', 13, 'economy'),
('B453-E-D28', 13, 'economy'),
('B453-E-D29', 13, 'economy'),
('B453-E-D3', 13, 'economy'),
('B453-E-D30', 13, 'economy'),
('B453-E-D31', 13, 'economy'),
('B453-E-D32', 13, 'economy'),
('B453-E-D33', 13, 'economy'),
('B453-E-D34', 13, 'economy'),
('B453-E-D35', 13, 'economy'),
('B453-E-D36', 13, 'economy'),
('B453-E-D37', 13, 'economy'),
('B453-E-D38', 13, 'economy'),
('B453-E-D39', 13, 'economy'),
('B453-E-D4', 13, 'economy'),
('B453-E-D40', 13, 'economy'),
('B453-E-D41', 13, 'economy'),
('B453-E-D5', 13, 'economy'),
('B453-E-D6', 13, 'economy'),
('B453-E-D7', 13, 'economy'),
('B453-E-D8', 13, 'economy'),
('B453-E-D9', 13, 'economy'),
('B453-P-A1', 13, 'platinum'),
('B453-P-A2', 13, 'platinum'),
('B453-P-A3', 13, 'platinum'),
('B453-P-A4', 13, 'platinum'),
('B453-P-A5', 13, 'platinum'),
('B453-P-B1', 13, 'platinum'),
('B453-P-B2', 13, 'platinum'),
('B453-P-B3', 13, 'platinum'),
('B453-P-B4', 13, 'platinum'),
('B453-P-B5', 13, 'platinum'),
('B453-P-C1', 13, 'platinum'),
('B453-P-C2', 13, 'platinum'),
('B453-P-C3', 13, 'platinum'),
('B453-P-C4', 13, 'platinum'),
('B453-P-C5', 13, 'platinum'),
('B453-P-D1', 13, 'platinum'),
('B453-P-D2', 13, 'platinum'),
('B453-P-D3', 13, 'platinum'),
('B453-P-D4', 13, 'platinum'),
('B453-P-D5', 13, 'platinum');

-- --------------------------------------------------------

--
-- Table structure for table `shedule`
--

CREATE TABLE `shedule` (
  `shedule_id` int(11) NOT NULL,
  `route_id` int(11) NOT NULL,
  `dept_time` time NOT NULL,
  `arr_time` time NOT NULL,
  `delay_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `shedule`
--

INSERT INTO `shedule` (`shedule_id`, `route_id`, `dept_time`, `arr_time`, `delay_id`) VALUES
(4, 8, '01:02:00', '02:05:00', NULL),
(5, 9, '16:02:00', '01:04:00', NULL),
(6, 7, '01:00:00', '02:00:00', NULL),
(7, 8, '01:02:00', '02:05:00', NULL),
(8, 8, '01:02:00', '02:05:00', NULL),
(9, 7, '13:49:00', '13:14:00', NULL),
(10, 7, '03:01:00', '02:00:00', NULL),
(11, 9, '09:08:00', '15:08:00', NULL),
(12, 8, '01:02:00', '02:05:00', NULL),
(15, 8, '01:02:00', '02:05:00', NULL),
(18, 7, '01:02:00', '01:07:00', NULL),
(23, 8, '01:02:00', '02:05:00', NULL),
(25, 8, '01:02:00', '02:05:00', NULL),
(26, 8, '08:09:00', '09:05:00', NULL),
(27, 9, '02:00:00', '15:08:00', NULL),
(28, 9, '00:00:00', '03:00:00', NULL),
(29, 10, '02:00:00', '01:02:00', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `ticket`
--

CREATE TABLE `ticket` (
  `ticket_id` varchar(20) NOT NULL,
  `reservation_id` int(11) NOT NULL,
  `full_name` varchar(40) NOT NULL,
  `age` int(11) NOT NULL,
  `gender` varchar(8) NOT NULL,
  `seat_id` varchar(20) NOT NULL,
  `requirements` varchar(40) DEFAULT NULL,
  `ticket_issued` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `time_table`
--

CREATE TABLE `time_table` (
  `time_table_id` int(11) NOT NULL,
  `date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `time_table`
--

INSERT INTO `time_table` (`time_table_id`, `date`) VALUES
(1, '2019-12-12'),
(3, '2019-12-20'),
(4, '2019-12-27'),
(12, '2020-02-01'),
(18, '2019-12-04');

-- --------------------------------------------------------

--
-- Table structure for table `time_table_shedule`
--

CREATE TABLE `time_table_shedule` (
  `time_table_id` int(11) NOT NULL,
  `shedule_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `time_table_shedule`
--

INSERT INTO `time_table_shedule` (`time_table_id`, `shedule_id`) VALUES
(1, 4),
(1, 5),
(1, 6),
(1, 7),
(1, 8),
(1, 9),
(1, 10),
(3, 11),
(4, 12),
(1, 15),
(12, 18),
(1, 23),
(18, 25),
(1, 26),
(1, 27),
(1, 28),
(1, 29);

-- --------------------------------------------------------

--
-- Table structure for table `trip`
--

CREATE TABLE `trip` (
  `trip_id` int(11) NOT NULL,
  `shedule_id` int(11) NOT NULL,
  `economy_price` decimal(8,2) DEFAULT '0.00',
  `business_price` decimal(8,2) DEFAULT '0.00',
  `platinum_price` decimal(8,2) DEFAULT '0.00',
  `tot_economy_passengers` int(11) NOT NULL DEFAULT '0',
  `tot_business_passengers` int(11) NOT NULL DEFAULT '0',
  `tot_platinum_passengers` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `trip`
--

INSERT INTO `trip` (`trip_id`, `shedule_id`, `economy_price`, `business_price`, `platinum_price`, `tot_economy_passengers`, `tot_business_passengers`, `tot_platinum_passengers`) VALUES
(4, 4, '100.00', '1000.00', '0.00', 0, 0, 0),
(5, 5, '200.00', '20.00', NULL, 0, 0, 0),
(6, 6, '1000.00', '45678.00', '0.00', 0, 0, 0),
(7, 7, '1000.00', '1000.00', '0.00', 0, 0, 0),
(8, 8, '1000.00', '100.00', NULL, 0, 0, 0),
(9, 9, '1000.00', '120000.00', '0.00', 0, 0, 0),
(10, 10, '199.00', '1900.00', '0.00', 0, 0, 0),
(11, 11, '123.00', '12.00', NULL, 0, 0, 0),
(12, 12, '120.00', '560.00', NULL, 0, 0, 0),
(13, 15, '1000.00', '12000.00', '0.00', 0, 0, 0),
(14, 18, '10.00', '100.00', NULL, 0, 0, 0),
(15, 23, '1000.00', '12000.00', '0.00', 0, 0, 0),
(16, 25, '11.00', '1.00', NULL, 0, 0, 0),
(17, 26, '100.00', '1000.00', '0.00', 0, 0, 0),
(18, 27, '100.00', '1000.00', NULL, 0, 0, 0),
(19, 28, '120.00', '1200.00', NULL, 0, 0, 0),
(20, 29, '140.00', '1400.00', NULL, 0, 0, 0);

-- --------------------------------------------------------

--
-- Stand-in structure for view `trip_seats`
-- (See below for the actual view)
--
CREATE TABLE `trip_seats` (
`trip_id` int(11)
,`available_economy_seats` bigint(12)
,`available_business_seats` bigint(12)
,`available_platinum_seats` bigint(12)
);

-- --------------------------------------------------------

--
-- Table structure for table `user_account`
--

CREATE TABLE `user_account` (
  `passenger_id` int(11) NOT NULL,
  `email` varchar(40) NOT NULL,
  `password` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `user_account`
--

INSERT INTO `user_account` (`passenger_id`, `email`, `password`) VALUES
(2, 'a', 'aa'),
(3, 'p', 'pp'),
(4, 'ss', 'ss'),
(5, 'g', 'gg'),
(6, 'cc', 'cc'),
(7, 'a', 'aa'),
(9, 'a', 'aa'),
(10, 'ffffff', 'f'),
(11, 'aaaaaaaa', 'aas'),
(12, 'bb', 'bb'),
(13, 'aa', 'aaaaaaaa'),
(14, 'ff@g.com', 'ffffffff');

-- --------------------------------------------------------

--
-- Structure for view `trip_seats`
--
DROP TABLE IF EXISTS `trip_seats`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `trip_seats`  AS  select `trip`.`trip_id` AS `trip_id`,(`plane_type`.`tot_economy_seats` - `trip`.`tot_economy_passengers`) AS `available_economy_seats`,(`plane_type`.`tot_business_seats` - `trip`.`tot_business_passengers`) AS `available_business_seats`,(`plane_type`.`tot_platinum_seats` - `trip`.`tot_platinum_passengers`) AS `available_platinum_seats` from ((((`trip` join `shedule` on((`trip`.`shedule_id` = `shedule`.`shedule_id`))) join `route` on((`shedule`.`route_id` = `route`.`route_id`))) join `plane` on((`route`.`plane_id` = `plane`.`plane_id`))) join `plane_type` on((`plane`.`plane_type_id` = `plane_type`.`plane_type_id`))) ;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `airport`
--
ALTER TABLE `airport`
  ADD PRIMARY KEY (`airport_id`);

--
-- Indexes for table `delay`
--
ALTER TABLE `delay`
  ADD PRIMARY KEY (`delay_id`);

--
-- Indexes for table `guest_passenger`
--
ALTER TABLE `guest_passenger`
  ADD PRIMARY KEY (`passenger_id`);

--
-- Indexes for table `member_passenger`
--
ALTER TABLE `member_passenger`
  ADD PRIMARY KEY (`passenger_id`),
  ADD KEY `category_id` (`category_id`);

--
-- Indexes for table `passenger_category`
--
ALTER TABLE `passenger_category`
  ADD PRIMARY KEY (`category_id`);

--
-- Indexes for table `plane`
--
ALTER TABLE `plane`
  ADD PRIMARY KEY (`plane_id`),
  ADD KEY `plane_type_id` (`plane_type_id`);

--
-- Indexes for table `plane_type`
--
ALTER TABLE `plane_type`
  ADD PRIMARY KEY (`plane_type_id`);

--
-- Indexes for table `regular_route_time`
--
ALTER TABLE `regular_route_time`
  ADD PRIMARY KEY (`route_id`);

--
-- Indexes for table `reservation`
--
ALTER TABLE `reservation`
  ADD PRIMARY KEY (`reservation_id`),
  ADD KEY `trip_id` (`trip_id`),
  ADD KEY `passenger_id` (`passenger_id`);

--
-- Indexes for table `route`
--
ALTER TABLE `route`
  ADD PRIMARY KEY (`route_id`),
  ADD KEY `plane_id` (`plane_id`),
  ADD KEY `dept_airport_id` (`dept_airport_id`),
  ADD KEY `dest_airport_id` (`dest_airport_id`);

--
-- Indexes for table `seat`
--
ALTER TABLE `seat`
  ADD PRIMARY KEY (`seat_id`),
  ADD KEY `plane_type_id` (`plane_type_id`);

--
-- Indexes for table `shedule`
--
ALTER TABLE `shedule`
  ADD PRIMARY KEY (`shedule_id`),
  ADD KEY `route_id` (`route_id`),
  ADD KEY `delay_id` (`delay_id`);

--
-- Indexes for table `ticket`
--
ALTER TABLE `ticket`
  ADD KEY `reservation_id` (`reservation_id`),
  ADD KEY `seat_id` (`seat_id`);

--
-- Indexes for table `time_table`
--
ALTER TABLE `time_table`
  ADD PRIMARY KEY (`time_table_id`);

--
-- Indexes for table `time_table_shedule`
--
ALTER TABLE `time_table_shedule`
  ADD KEY `time_table_id` (`time_table_id`),
  ADD KEY `shedule_id` (`shedule_id`);

--
-- Indexes for table `trip`
--
ALTER TABLE `trip`
  ADD PRIMARY KEY (`trip_id`),
  ADD KEY `shedule_id` (`shedule_id`);

--
-- Indexes for table `user_account`
--
ALTER TABLE `user_account`
  ADD PRIMARY KEY (`passenger_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `airport`
--
ALTER TABLE `airport`
  MODIFY `airport_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `delay`
--
ALTER TABLE `delay`
  MODIFY `delay_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `guest_passenger`
--
ALTER TABLE `guest_passenger`
  MODIFY `passenger_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `member_passenger`
--
ALTER TABLE `member_passenger`
  MODIFY `passenger_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `passenger_category`
--
ALTER TABLE `passenger_category`
  MODIFY `category_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `plane`
--
ALTER TABLE `plane`
  MODIFY `plane_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `plane_type`
--
ALTER TABLE `plane_type`
  MODIFY `plane_type_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `reservation`
--
ALTER TABLE `reservation`
  MODIFY `reservation_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `route`
--
ALTER TABLE `route`
  MODIFY `route_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `shedule`
--
ALTER TABLE `shedule`
  MODIFY `shedule_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT for table `time_table`
--
ALTER TABLE `time_table`
  MODIFY `time_table_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `trip`
--
ALTER TABLE `trip`
  MODIFY `trip_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `member_passenger`
--
ALTER TABLE `member_passenger`
  ADD CONSTRAINT `member_passenger_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `passenger_category` (`category_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `plane`
--
ALTER TABLE `plane`
  ADD CONSTRAINT `plane_ibfk_1` FOREIGN KEY (`plane_type_id`) REFERENCES `plane_type` (`plane_type_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `regular_route_time`
--
ALTER TABLE `regular_route_time`
  ADD CONSTRAINT `regular_route_time_ibfk_1` FOREIGN KEY (`route_id`) REFERENCES `route` (`route_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `reservation`
--
ALTER TABLE `reservation`
  ADD CONSTRAINT `reservation_ibfk_1` FOREIGN KEY (`passenger_id`) REFERENCES `member_passenger` (`passenger_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `reservation_ibfk_2` FOREIGN KEY (`passenger_id`) REFERENCES `guest_passenger` (`passenger_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `reservation_ibfk_3` FOREIGN KEY (`trip_id`) REFERENCES `trip` (`trip_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `reservation_ibfk_4` FOREIGN KEY (`passenger_id`) REFERENCES `member_passenger` (`passenger_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `reservation_ibfk_5` FOREIGN KEY (`passenger_id`) REFERENCES `guest_passenger` (`passenger_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `route`
--
ALTER TABLE `route`
  ADD CONSTRAINT `route_ibfk_1` FOREIGN KEY (`plane_id`) REFERENCES `plane` (`plane_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `route_ibfk_2` FOREIGN KEY (`dept_airport_id`) REFERENCES `airport` (`airport_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `route_ibfk_3` FOREIGN KEY (`dest_airport_id`) REFERENCES `airport` (`airport_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `seat`
--
ALTER TABLE `seat`
  ADD CONSTRAINT `seat_ibfk_1` FOREIGN KEY (`plane_type_id`) REFERENCES `plane_type` (`plane_type_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `shedule`
--
ALTER TABLE `shedule`
  ADD CONSTRAINT `shedule_ibfk_1` FOREIGN KEY (`route_id`) REFERENCES `route` (`route_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `shedule_ibfk_2` FOREIGN KEY (`delay_id`) REFERENCES `delay` (`delay_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `ticket`
--
ALTER TABLE `ticket`
  ADD CONSTRAINT `ticket_ibfk_1` FOREIGN KEY (`reservation_id`) REFERENCES `reservation` (`reservation_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `ticket_ibfk_2` FOREIGN KEY (`seat_id`) REFERENCES `seat` (`seat_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `time_table_shedule`
--
ALTER TABLE `time_table_shedule`
  ADD CONSTRAINT `time_table_shedule_ibfk_1` FOREIGN KEY (`time_table_id`) REFERENCES `time_table` (`time_table_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `time_table_shedule_ibfk_2` FOREIGN KEY (`shedule_id`) REFERENCES `shedule` (`shedule_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `trip`
--
ALTER TABLE `trip`
  ADD CONSTRAINT `trip_ibfk_1` FOREIGN KEY (`shedule_id`) REFERENCES `shedule` (`shedule_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `user_account`
--
ALTER TABLE `user_account`
  ADD CONSTRAINT `user_account_ibfk_1` FOREIGN KEY (`passenger_id`) REFERENCES `member_passenger` (`passenger_id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
