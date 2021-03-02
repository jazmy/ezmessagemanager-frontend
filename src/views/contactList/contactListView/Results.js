/* eslint-disable */
//We are importing react instance, and hooks that are as " useState & useEffect"
import React, { useState, useEffect } from "react";
//We are importing "clsx" for styling of our UI (table)
import clsx from "clsx";
//PropTypes :- this works under the hood for styling. We are doing ClassName work here, that
//...provides the style.
import PropTypes from "prop-types";
//We are importing the Library "moment"  that gives a shape to DateTime.
import moment from "moment";
//link to navigate
import { Link } from "react-router-dom";
//PerfectScrollbar is an element of that provides functionality to scroll.
import PerfectScrollbar from "react-perfect-scrollbar";
//Dialog represents to POPUP MODEL in whuuch we are doing add/edit job
import Dialog from "@material-ui/core/Dialog";
//DialogContent and DialogActions are the elements of Dialog
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
//IconButton is being represented in Action tab
import IconButton from "@material-ui/core/IconButton";
//we are calling Delete,Edit and before Icon here.
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
//We are invoking different methods here that we developd in an 'contactservice' before.
import { getContacts, deleteContactById, addContact, updateContact } from "./contactService";
import { getEmailTemplates } from "./../../mailsdesigner/MailsDesignerView/mailTemplateService";
//We are invoking sendAnEmail function from mailservice.
import { sendAnEmail } from "../../shared/mailService";
//import component to render

import EmployeeContactDetailsView from "src/views/employeecontactsdetailsview/EmployeeContactDetailsView";

//applo area starts
import { gql } from "apollo-boost";
import { useQuery } from "react-apollo";
//appolo area ends
//toast area
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
	const [ contact, setContact ] = useState([]);
	const [ emailTemplates, setEmailTemplates ] = useState([]);
	const [ dynamicEmployees, setDynamicEmployees ] = useState([]);
	const [ mode, setMode ] = useState("Add");
	// const [ querytosend, SetQueryToSend ] = useState(`query {
	//   user {
	//     id
	//   }
	// }`);
	const [ name, setName ] = useState("");
	const [ query, setquery ] = useState("");
	const [ contactId, setContactId ] = useState("");
	const [ flag, setFlag ] = useState(false);
	const [ selectedcontactIds, setSelectedcontactIds ] = useState([]);
	const [ from, setFrom ] = useState([]);
	const [ limit, setLimit ] = useState(10);
	const [ page, setPage ] = useState(0);
	const [ openDialog, setOpenDialog ] = useState(false);
	const [ openDialogForbefore, setOpenDialogForbefore ] = useState(false);
	//end of state initlizations.
	const [ templateId, setidtemplateId ] = React.useState("");

	//filter area
	const [ queryNameFil, setQueryNameFil ] = React.useState("");

	//filter area ends
	// const handleChange = (event) => {
	// 	setidtemplateId(event.target.value);
	// };
	// console.log(querytosend);
	// const GetEmployees = gql`${querytosend}`;
	// console.log(GetEmployees);
	// const { loading, error, data } = useQuery(GetEmployees);
	// const handleChangeforContact = (event) => {
	// 	setContactId(event.target.value);
	// 	let idOfSelectedQuery = event.target.value;
	// 	let filteredContact = contact.filter((c) => {
	// 		return c.id === idOfSelectedQuery;
	// 	});
	// 	// let query = filteredContact[0].query;
	// 	// SetQueryToSend(decodeURIComponent(query));
	// 	// if (loading) return 'Loading...';
	// 	if (error) return `Error! ${error.message}`;
	// };

	// useEffect(
	// 	() => {
	// 		if (data != null) {
	// 			setDynamicEmployees(data.employees);
	// 		}
	// 	},
	// 	[ data ]
	// );

	//this method plays with closing the model that handles edit/add contacts
	const handleClose = () => {
		setMode("Add");
		setContactId("");
		setName("");
		setquery("");
		setOpenDialog(false);
	};
	//this method plays with opening the model that handles edit/add contacts
	const handleOpenDialog = () => {
		setOpenDialog(true);
	};

	//this method plays with closing the model that handles sending before to the selected user
	// const handleCloseForEmails = () => {
	// 	// console.log("I'm here");

	// 	// SetQueryToSend(`query {
	// 	//     user {
	// 	//       id
	// 	//     }
	// 	//   }`);
	// 	setOpenDialogForbefore(false);
	// 	setContactId('');
	// 	setidtemplateId('');
	// 	while (dynamicEmployees.length) {
	// 		dynamicEmployees.pop();
	// 	}
	// 	return;
	// };

	//this method plays with closing the model that handles sending before to the selected user
	//it accepts the paramets of index
	// const handleOpenDialogForEmail = (index) => {
	// 	//now we are going to open sending before popup dialouge
	// 	setOpenDialogForbefore(true);
	// };

	//useEffect is a hook that get invokes when a components get loaded. we are calling
	//getAllcontacts function to load all contacts.
	useEffect(() => {
		getAllcontacts();
		getAllEmailTemplates();
	}, []);

	// this is our getAllcontacts function that get all users saved in Db
	const getAllcontacts = async () => {
		//In try block, we will try to execute our logic if works fine.
		try {
			let response = await getContacts();
			// we are setting contact equals to response of our functional Call.
			setContact(response);
			return;
		} catch (error) {
			// console.log(error);
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

	const getAllEmailTemplates = async () => {
		//In try block, we will try to execute our logic if works fine.
		try {
			let response = await getEmailTemplates();
			setEmailTemplates(response);
			return;
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
	//this is a function to update the contact, it accepts the index
	const updatecontact = (index) => {
		//In try block, we will try to execute our logic if works fine.
		try {
			let contactArray = contact;
			let obj = contactArray.filter((item) => {
				return item.id == index;
			});

			//we have two modes in our state, one is add, another one is "update", it sets to update
			//as we want to update now.
			setMode("Update");
			//set other required properties, that needs to populate.
			setContactId(obj[0].id);
			setName(obj[0].name);
			setquery(decodeURIComponent(obj[0].query));
			getContacts();
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

	//this function is responsible to send the befores.
	// const sendEmails = async (e) => {
	// 	e.preventDefault();
	// 	//In try block, we will try to execute our logic if works fine.
	// 	try {
	// 		//we are initlization a receipts_emails array, as this name is present in
	// 		//backend , we need to keep same names
	// 		let receipts_emails = [];
	// 		//we pushed the current email of our user to the receipts_emails
	// 		// receipts_emails.push(email);

	// 		for (let index = 0; index < dynamicEmployees.length; index++) {
	// 			const element = dynamicEmployees[index];
	// 			receipts_emails.push(element.email);
	// 		}

	// 		if (receipts_emails.length === 0) {
	// 			toast.error(`No Employee was found to send the email. Please select another query. `, {
	// 				position: 'top-right',
	// 				autoClose: 5000,
	// 				hideProgressBar: false,
	// 				closeOnClick: true,
	// 				pauseOnHover: true,
	// 				draggable: true,
	// 				progress: undefined,
	// 				transition: Flip
	// 			});
	// 			return;
	// 		} else {
	// 			let currentTemplateObj = emailTemplates.filter((et) => {
	// 				return et.id === templateId;
	// 			});
	// 			let subject = currentTemplateObj[0].subject;
	// 			let text = currentTemplateObj[0].shortmessage;
	// 			let htmlgen = currentTemplateObj[0].longmessage;
	// 			//we sent the request to the method that was developed in mailService.

	// 			toast.success(`Sending the email to emloyee(s) `, {
	// 				position: 'top-right',
	// 				autoClose: 5000,
	// 				hideProgressBar: false,
	// 				closeOnClick: true,
	// 				pauseOnHover: true,
	// 				draggable: true,
	// 				progress: undefined,
	// 				transition: Flip
	// 			});
	// 			let response = await sendAnEmail(receipts_emails, from, subject, text, htmlgen);
	// 			//now we are checking if the status is 200, then we show success message and
	// 			//clean the state to default values.
	// 			if (response.status === 200) {
	// 				toast.success(`Email(s) Sent Successfully!`, {
	// 					position: 'top-right',
	// 					autoClose: 5000,
	// 					hideProgressBar: false,
	// 					closeOnClick: true,
	// 					pauseOnHover: true,
	// 					draggable: true,
	// 					progress: undefined,
	// 					transition: Flip
	// 				});
	// 				setFrom('');
	// 				setidtemplateId('');
	// 				//we closed the dialouge!
	// 				handleCloseForEmails();
	// 				return;
	// 			}
	// 		}
	// 	} catch (error) {
	// 		//we closed the dialouge!
	// 		handleCloseForEmails();
	// 		//Here we are catching the error, and returning it.
	// 		toast.error(`Sorry, but an error occured, please try again later! `, {
	// 			position: 'top-right',
	// 			autoClose: 5000,
	// 			hideProgressBar: false,
	// 			closeOnClick: true,
	// 			pauseOnHover: true,
	// 			draggable: true,
	// 			progress: undefined,
	// 			transition: Flip
	// 		});
	// 	}
	// };

	//this function get executed by submit button of add/update dialoge
	//this decide if should we call ADDcontact OR Update contact
	const operateFunction = (e) => {
		if (mode === "Add") {
			addcontact(e);
		} else {
			//to update an contact
			// handleSubmit = Update contact
			handleSubmit(e);
		}
	};

	//We are adding an contact here.
	const addcontact = async (e) => {
		e.preventDefault();

		try {
			let response = await addContact(name, encodeURIComponent(query));
			//now we are checking if the status is 200, then we show success message and
			//clean the state to default values.
			if (response.status === 200) {
				toast.success(`Contact Added Successfully!'`, {
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
				getAllcontacts();
				return;
			}
		} catch (error) {
			//Here we are catching the error, and returning it.
			toast.error(`Sorry, but an error occured, please try again later! `, {
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

	//Here we are going to perform operation of Update An contact
	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			let response = await updateContact(contactId, name, encodeURIComponent(query));
			operatequeryUpdateFun(response);
		} catch (error) {
			// console.log(error);
			//Here we are catching the error, and returning it.
			toast.error(`Sorry, but an error occured, please try again later! `, {
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

	//common function that is needed
	const operatequeryUpdateFun = (response) => {
		//now we are checking if the status is 200, then we show success message and
		//clean the state to default values.
		if (response.status === 200) {
			toast.success(`Contact Updated Successfully!`, {
				position: "top-right",
				autoClose: 5000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				transition: Flip
			});
			setMode("Add");
			//fetch all latest contacts.
			getAllcontacts();
			//close the dialouge
			handleClose();
			return;
		}
	};
	//Here we are going to perform operation of deleet An contact, this accepts index param...

	const deleteContact = async (index) => {
		try {
			let contactArray = contact;
			let obj = contactArray.filter((item) => {
				return item.id == index;
			});

			//We are just confirming if a user really want to delete that guy?
			if (window.confirm(`Are you sure to delete ${obj[0].name.toUpperCase()}!`)) {
				//as we have the id of a user so we wil delete
				let id = obj[0].id;
				await deleteContactById(id);
				// query deleting that, we will filter our contact state, that is infact an
				//array type, to remove the deleted guy!
				let newcontact = contact.filter((ct) => ct.id !== id);

				toast.success(`Contact Deleted SuccessfullySorry! `, {
					position: "top-right",
					autoClose: 5000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,
					transition: Flip
				});
				//we got new set of contact, so we will just re write it.
				setContact(newcontact);
				return;
			} else {
				return;
			}
		} catch (error) {
			//Here we are catching the error, and returning it.
			toast.error(`Sorry, but an error occured, please try again later! `, {
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

	//this was developed by theme provider so ignore this
	const handleSelectAll = (event) => {
		if (contact.length > 0) {
			let newSelectedcontactIds;

			if (event.target.checked) {
				newSelectedcontactIds = contact.map((ct) => ct.id);
			} else {
				newSelectedcontactIds = [];
			}

			setSelectedcontactIds(newSelectedcontactIds);
			if (newSelectedcontactIds.length > 0) {
				setFlag(true);
			} else {
				setFlag(false);
			}
		}
	};

	const handleSelectOne = (event, id) => {
		const selectedIndex = selectedcontactIds.indexOf(id);
		let newSelectedcontactIds = [];

		if (selectedIndex === -1) {
			newSelectedcontactIds = newSelectedcontactIds.concat(selectedcontactIds, id);
		} else if (selectedIndex === 0) {
			newSelectedcontactIds = newSelectedcontactIds.concat(selectedcontactIds.slice(1));
		} else if (selectedIndex === selectedcontactIds.length - 1) {
			newSelectedcontactIds = newSelectedcontactIds.concat(selectedcontactIds.slice(0, -1));
		} else if (selectedIndex > 0) {
			newSelectedcontactIds = newSelectedcontactIds.concat(
				selectedcontactIds.slice(0, selectedIndex),
				selectedcontactIds.slice(selectedIndex + 1)
			);
		}

		setSelectedcontactIds(newSelectedcontactIds);
		if (newSelectedcontactIds.length > 0) {
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
			if (confirm(`Are you sure to delete ${selectedcontactIds.length} Tag(s)`)) {
				for (let index = 0; index < selectedcontactIds.length; index++) {
					const element = selectedcontactIds[index];
					let id = element;
					await deleteContactById(id);
					if (index === selectedcontactIds.length - 1) {
						toast.success(`Selected Contact(s) Deleted Successfully.`, {
							position: "top-right",
							autoClose: 5000,
							hideProgressBar: false,
							closeOnClick: true,
							pauseOnHover: true,
							draggable: true,
							progress: undefined,
							transition: Flip
						});
						getAllcontacts();
						setFlag(false);
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
					<div className="p-24">
						{/* <Dialog
							open={openDialogForbefore}
							onClose={handleCloseForEmails}
							aria-labelledby="form-dialog-title"
							classes={{
								paper: 'rounded-8'
							}}
						> */}
						{/* <DialogContent style={{ width: 400 }} classes={{ root: 'p-16 pb-0 sm:p-24 sm:pb-0' }}> */}
						{/* <TextField
									className="mt-8 mb-16"
									label="From"
									id="from"
									type="before"
									value={from}
									name="from"
									onChange={(e) => setFrom(e.currentTarget.value)}
									variant="outlined"
									fullWidth
								/>
								<br /> <br /> */}
						{/* </DialogContent> */}

						{/* <FormControl
								style={{
									maxWidth: 350,
									marginLeft: 30
								}}
							>
								<InputLabel id="demo-simple-select-helper-label">Select Contact List</InputLabel>
								<Select
									className="mt-8 mb-60"
									labelId="demo-simple-select-helper-label"
									id="demo-simple-select-helper"
									value={contactId}
									onChange={handleChangeforContact}
									fullWidth
								>
									{
										contact.length > 0 ? contact.map((ct, index) => {
											return (
												<MenuItem key={index} value={ct.id}>
													{ct.name}
												</MenuItem>
											);
										}) :
										null}
								</Select>
							</FormControl>
							<br /> */}

						{/* <FormControl
								style={{
									maxWidth: 350,
									marginLeft: 30
								}}
							>
								<InputLabel id="demo-simple-select-helper-label">Select Email Template</InputLabel>
								<Select
									className="mt-8 mb-60"
									labelId="demo-simple-select-helper-label"
									id="demo-simple-select-helper"
									value={templateId}
									onChange={handleChange}
									fullWidth
								>
									{
										emailTemplates.length > 0 ? emailTemplates.map((eT, index) => {
											return (
												<MenuItem key={index} value={eT.id}>
													{eT.templatename}
												</MenuItem>
											);
										}) :
										null}
								</Select>
							</FormControl> */}
						{/* {
								dynamicEmployees.length > 0 ? <div>
									<p>{dynamicEmployees.length} Employee(s) found!</p>
								</div> :
								null}
							{
								dynamicEmployees.length > 0 ? dynamicEmployees.map((dE, index) => {
									return (
										<div
											key={index}
											style={{ cursor: 'pointer' }}
											className="w3-tag w3-round w3-green w3-border w3-border-white"
										>
											{dE.email}
										</div>
									);
								}) :
								null} */}
						{/* Buttons Area */}
						{/* <DialogActions className="justify-between p-8">
								<div className="px-16">
									<Button
										style={{ alignItems: 'left', marginRight: 10 }}
										variant="contained"
										color="secondary"
										onClick={handleCloseForEmails}
									>
										Close
									</Button>
									<Button variant="contained" color="primary" onClick={sendEmails}>
										Send
									</Button>
								</div>
							</DialogActions> */}
						{/* </form> */}
						{/* </Dialog> */}
					</div>
				</Box>
			</div>

			<Box display="flex" justifyContent="flex-end">
				{/* This is a button on top right side to ask if a user wants to add an contact
         it triggers handleOpenDialog function */}

				{
					flag ? <Button
						style={{ color: "red" }}
						color="default"
						onClick={handleBulkDelete}
						variant="contained"
					>
						<i className="fa fa-trash" aria-hidden="true" />
						Delete Selected Contact(s)
					</Button> :
					null}

				<Button style={{ marginLeft: 5 }} color="primary" onClick={handleOpenDialog} variant="contained">
					<i className="fa fa-plus" aria-hidden="true" />
					Add New contact
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
								<Icon color="action">{mode.toUpperCase()} An contact</Icon>
							</div>
							<br />
							<br />
							<TextField
								className="mb-12"
								label="Name of Query"
								autoFocus
								type="text"
								value={name}
								name="name"
								onChange={(e) => setName(e.currentTarget.value)}
								placeholder="Name"
								variant="outlined"
								fullWidth
							/>

							<br />
						</div>

						<br />
						<TextField
							className="mb-12"
							label="GraphQL Query"
							type="text"
							value={query}
							name="query"
							onChange={(e) => setquery(e.currentTarget.value)}
							placeholder="GraphQl Query, to see example of query, please check this:- https://graphql.org/learn/queries/"
							variant="outlined"
							fullWidth
							multiline
							rows={6}
						/>
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
								{mode} contact
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
										checked={selectedcontactIds.length === contact.length}
										color="primary"
										indeterminate={
											selectedcontactIds.length > 0 && selectedcontactIds.length < contact.length
										}
										onChange={handleSelectAll}
									/>
								</TableCell>
								{/* rendering of header area starts from here */}
								<TableCell>
									Name Of Query
									<input
										autoFocus
										placeholder="Query Name To Filter"
										className="input-Style-For-designer"
										type="text"
										value={queryNameFil}
										onChange={(event) => {
											setQueryNameFil(event.target.value);
										}}
									/>
								</TableCell>
								<TableCell>Action</TableCell>
								{/* rendering of header area ends  here */}
							</TableRow>
						</TableHead>

						<TableBody key={page}>
							{
								contact.length > 0 ? contact
									.slice(page * limit, (page + 1) * limit)
									.filter((val) => {
										if (queryNameFil === "") {
											return val;
										} else if (val.name.toLowerCase().includes(queryNameFil.toLowerCase())) {
											return val;
										}
									})
									.map((ct, index) => (
										<TableRow hover key={ct.id} selected={selectedcontactIds.indexOf(ct.id) !== -1}>
											<TableCell padding="checkbox">
												<Checkbox
													checked={selectedcontactIds.indexOf(ct.id) !== -1}
													onChange={(event) => handleSelectOne(event, ct.id)}
													value="true"
												/>
											</TableCell>
											<TableCell>
												<Box alignItems="center" display="flex">
													<Typography color="textPrimary" variant="body1">
														{ct.name}
													</Typography>
												</Box>
											</TableCell>
											{/* Buttons area to send before/edit/delete starts from here */}
											<TableCell>
												{/* <IconButton
												aria-label="Update"
												onClick={() => handleOpenDialogForEmail(index)}
												className={classes.margin}
											>
												<i className="fa fa-rocket" aria-hidden="true" />
											</IconButton> */}
												<Link to={"/app/contact-list/details/" + ct.id}>
													<IconButton
														aria-label="Update"
														// onClick={() => openDetailPage(index)}
														className={classes.margin}
													>
														<i className="fas fa-address-book" />
													</IconButton>
												</Link>
												<IconButton
													aria-label="Update"
													onClick={() => updatecontact(ct.id)}
													className={classes.margin}
												>
													<EditIcon />
												</IconButton>

												<IconButton
													aria-label="delete"
													onClick={() => deleteContact(ct.id)}
													className={classes.margin}
												>
													<DeleteIcon />
												</IconButton>
												{/* Buttons area to send before/edit/delete starts ends here */}
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
				count={contact.length}
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
