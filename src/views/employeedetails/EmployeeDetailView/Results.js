//We are importing react instance, and hooks that are as " useState & useEffect"
import React, { useState, useEffect, Fragment } from "react";
//We are importing "clsx" for styling of our UI (table)
import clsx from "clsx";
//PropTypes :- this works under the hood for styling. We are doing ClassName work here, that
//...provides the style.
import PropTypes from "prop-types";
//We are importing the Library "moment"  that gives a shape to DateTime.
import moment from "moment";
//PerfectScrollbar is an element of that provides functionality to scroll.
import PerfectScrollbar from "react-perfect-scrollbar";
//Dialog represents to POPUP MODEL in whuuch we are doing add/edit job
import Dialog from "@material-ui/core/Dialog";
//DialogContent and DialogActions are the elements of Dialog
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
//We are invoking different methods here that we developd in an 'employeeservice' before.
import { getEployeeById } from "./employeeService";
//toast
import "./result.css";
import { toast, Flip } from "react-toastify";
//We are importing many useful UI elements here that we need to make our UI beautiful.
import {
	Icon,
	Box,
	Card,
	Checkbox,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TablePagination,
	TableRow,
	Typography,
	makeStyles,
	Button,
	TextField,
	Select,
	MenuItem,
	IconButton
} from "@material-ui/core";

//makeStyles is hook in '@material-ui/core', that is an initilizer to give styling
const useStyles = makeStyles((theme) => ({
	root: {},
	avatar: {
		marginRight: theme.spacing(2)
	},
	margin: {
		margin: theme.spacing(1)
	},
	extendedIcon: {
		marginRight: theme.spacing(1)
	}
}));

//We are defining our custom functional component named as Results here, that accepts (or may accept) classes and other params by index.js
const Results = ({ className, ...rest }) => {
	//we initilized classes vaiable here.
	const classes = useStyles();
	//Start of state initlizations.

	// we are defining different states here by using useState hook
	//for more detail please check this.
	//https://reactjs.org/docs/hooks-state.html
	const [ employee, setemployee ] = useState([]);
	const [ employeeTags, setemployeeTags ] = useState([]);
	const [ employeeMetaData, setEmployeeMetaData ] = useState([]);

	useEffect(() => {
		let str = window.location.href;
		let id = str.replace(/.*\/(\w+)\/?$/, "$1");
		getAllEmployeeById(id);
	}, []);

	// this is our getAllEmployees function that get all users saved in Db
	const getAllEmployeeById = async (id) => {
		//In try block, we will try to execute our logic if works fine.
		try {
			let response = await getEployeeById(id);
			// console.log(response);
			setemployee(response);
			setemployeeTags(response.tags);
			setEmployeeMetaData(response.employee_meta_data);
			return;
		} catch (error) {
			console.log(error);
			//Here we are catching the error, and returning it.

			toast.error(`Sorry, but an error occured! Please try again later. `, {
				position: "top-right",
				autoClose: 5000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				transition: Flip
			});
		}
	};

	//this is a part where we are rendering the End User Part that he sees.
	return (
		<Card className={clsx(classes.root, className)} {...rest}>
			<Box display="flex" justifyContent="flex-end">
				<Box minWidth={1220}>
					<PerfectScrollbar>
						<Table>
							<TableHead>
								<TableRow>
									<TableCell variant="head">Id</TableCell>
									<TableCell variant="head">First Name</TableCell>
									<TableCell variant="head">Last Name</TableCell>
									<TableCell variant="head">Email</TableCell>
									<TableCell variant="head">Tags</TableCell>

									{
										employeeMetaData.length > 0 ? employeeMetaData.map((emp, index) => {
											return (
												<TableCell key={index} variant="head">
													{emp.field_name}
												</TableCell>
											);
										}) :
										null}

									{/* rendering of header area ends  here */}
								</TableRow>
							</TableHead>
							<TableBody>
								<TableRow>
									<TableCell>{employee.id}</TableCell>
									<TableCell>{employee.firstname}</TableCell>
									<TableCell>{employee.lastname}</TableCell>
									<TableCell>{employee.email}</TableCell>

									<TableCell>
										{
											employeeTags.length > 0 ? employeeTags.map((tg, index) => {
												return (
													<div
														key={index}
														style={{ cursor: "pointer" }}
														className="w3-tag w3-round w3-green w3-border w3-border-white"
													>
														{tg.tag}
													</div>
												);
											}) :
											null}
									</TableCell>
									{
										employeeMetaData.length > 0 ? employeeMetaData.map((emp, index) => {
											return <TableCell key={index}>{emp.content}</TableCell>;
										}) :
										null}
								</TableRow>
							</TableBody>
						</Table>
					</PerfectScrollbar>
				</Box>
			</Box>

			{/* Here table area stats */}
		</Card>
	);
};

Results.propTypes = {
	className: PropTypes.string
};

//so boom! we exports this from here and consumes in Index.js to display to the potential pair
// of eyes
export default Results;
