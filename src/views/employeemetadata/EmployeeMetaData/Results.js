//We are importing react instance, and hooks that are as " useState & useEffect"
import React, { useState, useEffect } from "react";
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
//IconButton is being represented in Action tab
import IconButton from "@material-ui/core/IconButton";
//we are calling Delete,Edit and Email Icon here.
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import EmailIcon from "@material-ui/icons/Email";
//We are invoking different methods here that we developd in an 'empMetaFieldsservice' before.
import {
	getEployeesMetaFields,
	deleteEployeeMetaFields,
	addAnempMetaFields,
	updateAnempMetaFields
} from "./empMetaFieldsService";
//We are invoking sendAnEmail function from mailservice.

//toast
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
	MenuItem
} from "@material-ui/core";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import { ControlPointSharp } from "@material-ui/icons";
import "./result.css";

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
	const [ empMetaFields, setempMetaFields ] = useState([]);
	const [ flag, setFlag ] = useState(false);
	const [ empTags, setEmpTags ] = useState([]);
	const [ mode, setMode ] = useState("Add");
	const [ empId, setEmpId ] = useState();
	const [ field_name, setfield_name ] = useState(" ");
	const [ selectedempMetaFieldsIds, setSelectedempMetaFieldsIds ] = useState([]);
	const [ limit, setLimit ] = useState(10);
	const [ page, setPage ] = useState(0);
	const [ openDialog, setOpenDialog ] = useState(false);

	//filter area starts
	const [ field_nameFil, setfield_nameFil ] = useState("");
	const [ idFil, setIdFil ] = useState("");

	//filter area ends
	//end of state initlizations.

	//this method plays with closing the model that handles edit/add empMetaFieldss
	const handleClose = () => {
		setMode("Add");
		setfield_name("");
		setOpenDialog(false);
	};
	//this method plays with opening the model that handles edit/add empMetaFieldss
	const handleOpenDialog = () => {
		setOpenDialog(true);
	};

	//useEffect is a hook that get invokes when a components get loaded. we are calling
	//getAllempMetaFieldss function to load all empMetaFieldss.
	useEffect(() => {
		getAllempMetaFieldss();
	}, []);

	// this is our getAllempMetaFieldss function that get all users saved in Db
	const getAllempMetaFieldss = async () => {
		//In try block, we will try to execute our logic if works fine.
		try {
			let response = await getEployeesMetaFields();
			// we are setting empMetaFields equals to response of our functional Call.
			// Note:- We defined getEployeesMetaFields() in empMetaFieldsService.
			setempMetaFields(response);
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

	//this is a function to update the empMetaFields, it accepts the index
	const updateempMetaFields = (index) => {
		//In try block, we will try to execute our logic if works fine.
		try {
			let empMetaFieldArray = empMetaFields;
			let obj = empMetaFieldArray.filter((item) => {
				return item.id == index;
			});
			setfield_name(obj[0].field_name);
			//we have two modes in our state, one is add, another one is "update", it sets to update
			//as we want to update now.
			setMode("Update");
			//set other required properties, that needs to populate.
			setEmpId(obj[0].id);
			//finally it opens that POP-UP
			handleOpenDialog();
		} catch (error) {
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

	//this function get executed by submit button of add/update dialoge
	//this decide if should we call ADDempMetaFields OR Update empMetaFields
	const operateFunction = (e) => {
		if (mode === "Add") {
			addempMetaFields(e);
		} else {
			//to update an empMetaFields
			// handleSubmit = Update empMetaFields
			handleSubmit(e);
		}
	};

	//We are adding an empMetaFields here.
	const addempMetaFields = async (e) => {
		e.preventDefault();

		try {
			//if email pattern goes well, we are invoking addAnempMetaFields function, that was
			//developed in Service and sending the required params.
			let response = await addAnempMetaFields(field_name);
			//now we are checking if the status is 200, then we show success message and
			//clean the state to default values.
			if (response.status === 200) {
				toast.success(`MetaFields Added Successfully!`, {
					position: "top-right",
					autoClose: 5000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,
					transition: Flip
				});

				handleClose();
				getAllempMetaFieldss();
				return;
			}
		} catch (error) {
			//Here we are catching the error, and returning it.
			toast.error(`Sorry, but an error occured.`, {
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

	//Here we are going to perform operation of Update An empMetaFields
	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			let response = await updateAnempMetaFields(empId, field_name);
			//now we are checking if the status is 200, then we show success message and
			//clean the state to default values.
			if (response.status === 200) {
				toast.success(`Eployee Meta Field Updated Successfully!`, {
					position: "top-right",
					autoClose: 5000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,
					transition: Flip
				});
				getAllempMetaFieldss();
				setfield_name(" ");
				setMode("Add");
				//fetch all latest empMetaFieldss.
				getAllempMetaFieldss();
				//close the dialouge
				handleClose();
				return;
			} else {
				toast.error(`Sorry, but an error occured.`, {
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
		} catch (error) {
			// console.log(error);
			//Here we are catching the error, and returning it.
			toast.error(`Sorry, but an error occured.`, {
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

	//Here we are going to perform operation of deleet An empMetaFields, this accepts index param...

	const deleteempMetaFields = async (index) => {
		try {
			let empMetaFieldArray = empMetaFields;
			let obj = empMetaFieldArray.filter((item) => {
				return item.id == index;
			});
			//We are just confirming if a user really want to delete that guy?
			if (window.confirm(`Are you sure to delete ${obj[0].field_name.toUpperCase()}!`)) {
				//as we have the id of a user so we wil delete
				let id = obj[0].id;
				await deleteEployeeMetaFields(id);
				// after deleting that, we will filter our empMetaFields state, that is infact an
				//array type, to remove the deleted guy!
				let newempMetaFields = empMetaFields.filter((emp) => emp.id !== id);
				toast.success(`Employee MetaFields Deleted Successfully! `, {
					position: "top-right",
					autoClose: 5000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,
					transition: Flip
				});
				//we got new set of empMetaFields, so we will just re write it.
				setempMetaFields(newempMetaFields);
				return;
			} else {
				return;
			}
		} catch (error) {
			//Here we are catching the error, and returning it.
			toast.error(`Sorry, but an error occured.`, {
				position: "top-right",
				autoClose: 5000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				transition: Flip
			});

			return;
		}
	};

	// remove current tags end
	//this was developed by theme provider so ignore this
	const handleSelectAll = (event) => {
		if (empMetaFields.length > 0) {
			let newSelectedempMetaFieldsIds = [];

			if (event.target.checked) {
				newSelectedempMetaFieldsIds =

						empMetaFields.length > 0 ? empMetaFields.map((emp) => emp.id) :
						null;
			} else {
				newSelectedempMetaFieldsIds = [];
			}

			setSelectedempMetaFieldsIds(newSelectedempMetaFieldsIds);
			if (newSelectedempMetaFieldsIds.length > 0) {
				setFlag(true);
			} else {
				setFlag(false);
			}
		}
	};

	const handleSelectOne = (event, id) => {
		const selectedIndex = selectedempMetaFieldsIds.indexOf(id);

		let newSelectedempMetaFieldsIds = [];

		if (selectedIndex === -1) {
			newSelectedempMetaFieldsIds = newSelectedempMetaFieldsIds.concat(selectedempMetaFieldsIds, id);
		} else if (selectedIndex === 0) {
			newSelectedempMetaFieldsIds = newSelectedempMetaFieldsIds.concat(selectedempMetaFieldsIds.slice(1));
		} else if (selectedIndex === selectedempMetaFieldsIds.length - 1) {
			newSelectedempMetaFieldsIds = newSelectedempMetaFieldsIds.concat(selectedempMetaFieldsIds.slice(0, -1));
		} else if (selectedIndex > 0) {
			newSelectedempMetaFieldsIds = newSelectedempMetaFieldsIds.concat(
				selectedempMetaFieldsIds.slice(0, selectedIndex),
				selectedempMetaFieldsIds.slice(selectedIndex + 1)
			);

			setSelectedempMetaFieldsIds(newSelectedempMetaFieldsIds);
			if (newSelectedempMetaFieldsIds.length > 0) {
				setFlag(true);
			} else {
				setFlag(false);
			}
		}

		setSelectedempMetaFieldsIds(newSelectedempMetaFieldsIds);
		if (newSelectedempMetaFieldsIds.length > 0) {
			setFlag(true);
		} else {
			setFlag(false);
		}
	};
	//this was developed by theme provider so ignore this

	//END

	//this check how many records should we show on page
	const handleLimitChange = (event) => {
		setLimit(event.target.value);
	};

	//this handle the page navigation etc inside a component
	const handlePageChange = (event, newPage) => {
		setPage(newPage);
	};

	// bulk delete
	const handleBulkDelete = async () => {
		try {
			if (confirm(`Are you sure to delete ${selectedempMetaFieldsIds.length} empMetaFields(s)`)) {
				for (let index = 0; index < selectedempMetaFieldsIds.length; index++) {
					const element = selectedempMetaFieldsIds[index];
					let id = element;
					await deleteEployeeMetaFields(id);
					if (index === selectedempMetaFieldsIds.length - 1) {
						toast.success(`Selected Emp MetaField(s) Deleted Successfully`, {
							position: "top-right",
							autoClose: 5000,
							hideProgressBar: false,
							closeOnClick: true,
							pauseOnHover: true,
							draggable: true,
							progress: undefined,
							transition: Flip
						});
						getAllempMetaFieldss();
						return;
					}
				}
			}
		} catch (error) {
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
			<div className={clsx(classes.root, className)} {...rest}>
				<Box display="flex" justifyContent="flex-end">
					{/* we have a diaglog here to show POPUP */}
					{/* To learn how to play with forms please check folowing link
          https://reactjs.org/docs/forms.html 
          ****WE ARE USING SOME MORE ADVANCED WAY TO DO THIS***
          */}
				</Box>
			</div>

			<Box display="flex" justifyContent="flex-end">
				{/* This is a button on top right side to ask if a user wants to add an empMetaFields
         it triggers handleOpenDialog function */}
				{
					flag ? <div>
						<Button style={{ color: "red" }} color="default" onClick={handleBulkDelete} variant="contained">
							<i className="fa fa-trash" aria-hidden="true" />
							Delete Selected empMetaFields(s)
						</Button>
					</div> :
					null}
				<Button style={{ marginLeft: 5 }} color="primary" onClick={handleOpenDialog} variant="contained">
					<i className="fa fa-plus" aria-hidden="true" />
					Add New Employee MetaField
				</Button>

				{/* we have a diaglog here to show POPUP */}
				{/* To learn how to play with forms please check folowing link
          https://reactjs.org/docs/forms.html 
          ****WE ARE USING SOME MORE ADVANCED WAY TO DO THIS***
          */}

				<Dialog
					classes={{
						paper: "m-24 rounded-8"
					}}
					open={openDialog}
					onClose={handleClose}
					aria-labelledby="form-dialog-title"
					fullWidth
					maxWidth="sm"
				>
					<DialogContent classes={{ root: "p-24" }}>
						<div className="flex">
							<div className="min-w-24 pt-10">
								{/* This mode is what I described above, this is dynamic, decides on fly if we are going
                 to do "update or add" job */}
								<Icon color="action">{mode} Employee Meta Field</Icon>
							</div>
							<br />
							<TextField
								autoFocus
								className="mb-12"
								label="Field Name"
								type="text"
								value={field_name || ""}
								name="field_name"
								onChange={(e) => setfield_name(e.currentTarget.value)}
								placeholder="Field Name"
								variant="outlined"
								fullWidth
							/>
							<br />
						</div>
						<br />
					</DialogContent>
					<DialogActions className="justify-between p-8">
						{/* Buttons Area */}
						<div className="px-16">
							<Button
								style={{ alignItems: "left", marginRight: 10 }}
								variant="contained"
								color="secondary"
								onClick={handleClose}
							>
								Close
							</Button>
							{/* It calls operateFunction fun. that decides on the base of mode that what should it do */}
							<Button variant="contained" color="primary" onClick={operateFunction} type="submit">
								{mode} Employee Meta Field
							</Button>
						</div>
					</DialogActions>
				</Dialog>
			</Box>

			{/* Here table area stats */}
			<PerfectScrollbar>
				<Box minWidth={1050}>
					<Table>
						<TableHead>
							<TableRow>
								{/* This was developed by UI provider, so ignore that, we might need that in future */}
								<TableCell padding="checkbox">
									<Checkbox
										checked={selectedempMetaFieldsIds.length === empMetaFields.length}
										color="primary"
										indeterminate={
											selectedempMetaFieldsIds.length > 0 &&
											selectedempMetaFieldsIds.length < empMetaFields.length
										}
										onChange={handleSelectAll}
									/>
								</TableCell>
								{/* rendering of header area starts from here */}

								<TableCell>
									Field Id
									<input
										className="input-Style-For-Emp"
										type="text"
										value={idFil}
										onChange={(event) => {
											setIdFil(event.target.value);
										}}
									/>
								</TableCell>

								<TableCell>
									Field Name
									<input
										className="input-Style-For-Emp"
										type="text"
										value={field_nameFil}
										onChange={(event) => {
											setfield_nameFil(event.target.value);
										}}
									/>
								</TableCell>

								<TableCell>Action</TableCell>
								{/* rendering of header area ends  here */}
							</TableRow>
						</TableHead>

						{/* BODY OF TABLE STARTS FROM HERE
             =>we check that id length of an empMetaFields array is greater than zero, then
            =>we renders/ map it else, we return null to avoide potentially errors 
            */}
						{/* {console.log(empMetaFields)} */}
						<TableBody key={page}>
							{
								empMetaFields.length > 0 ? empMetaFields
									.slice(page * limit, (page + 1) * limit)
									.filter((val) => {
										if (field_nameFil === "" && idFil === "") {
											return val;
										} else if (
											val.field_name.toLowerCase().includes(field_nameFil.toLowerCase()) &&
											val.id.toString().toLowerCase().includes(idFil.toLowerCase())
										) {
											return val;
										}
									})
									.map((emp, index) => (
										<TableRow
											hover
											key={emp.id}
											selected={selectedempMetaFieldsIds.indexOf(emp.id) !== -1}
										>
											<TableCell padding="checkbox">
												<Checkbox
													checked={selectedempMetaFieldsIds.indexOf(emp.id) !== -1}
													onChange={(event) => handleSelectOne(event, emp.id)}
													value="true"
												/>
											</TableCell>
											<TableCell>
												<Box alignItems="center" display="flex">
													<Typography color="textPrimary" variant="body1">
														{emp.id}
													</Typography>
												</Box>
											</TableCell>
											<TableCell> {emp.field_name}</TableCell>

											{/* Buttons area to send email/edit/delete starts from here */}
											<TableCell>
												<IconButton
													aria-label="Update"
													onClick={() => updateempMetaFields(emp.id)}
													className={classes.margin}
												>
													<EditIcon />
												</IconButton>

												<IconButton
													aria-label="delete"
													onClick={() => deleteempMetaFields(emp.id)}
													className={classes.margin}
												>
													<DeleteIcon />
												</IconButton>
												{/* Buttons area to send email/edit/delete starts ends here */}
											</TableCell>
											<TableCell />
										</TableRow>
									)) :
								null}
						</TableBody>
					</Table>
				</Box>
			</PerfectScrollbar>

			{/* this deals with page options like how many records per page should we render */}
			<TablePagination
				component="div"
				count={empMetaFields.length}
				onChangePage={handlePageChange}
				onChangeRowsPerPage={handleLimitChange}
				page={page}
				rowsPerPage={limit}
				rowsPerPageOptions={[ 5, 10, 25 ]}
			/>
		</Card>
	);
};

Results.propTypes = {
	className: PropTypes.string
};

//so boom! we exports this from here and consumes in Index.js to display to the potential pair
// of eyes
export default Results;
