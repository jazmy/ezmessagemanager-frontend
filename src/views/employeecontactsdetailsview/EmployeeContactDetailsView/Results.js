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

import EmailIcon from "@material-ui/icons/Email";

import { getContactById, updateContact } from "../../contactList/contactListView/contactService";
//We are invoking sendAnEmail function from mailservice.
import { sendAnEmail } from "../../shared/mailService";
//mail templates
import { getEmailTemplates } from "../../mailsdesigner/MailsDesignerView/mailTemplateService";
//tag service
//toast
import { toast, Flip } from "react-toastify";
//applo area starts
import { gql } from "apollo-boost";
import { useQuery } from "react-apollo";
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
	const [ employee, setemployee ] = useState([]);
	const [ queryName, setQueryName ] = useState([]);
	const [ query, setQuery ] = useState([]);
	const [ querytosend, SetQueryToSend ] = useState(`query {
    user {
      id
    }
  }`);
	const [ theTags, settheTags ] = useState([]);
	const [ emailTemplates, setEmailTemplates ] = useState([]);
	const [ firstname, setFirstName ] = useState("");
	const [ lastname, setLastName ] = useState("");
	const [ email, setEmail ] = useState("");
	const [ from, setFrom ] = useState([]);
	const [ limit, setLimit ] = useState(10);
	const [ page, setPage ] = useState(0);
	const [ openDialogForEmail, setOpenDialogForEmail ] = useState(false);
	const [ openDialogForBulkTags, setOpenDialogForBulkTags ] = useState(false);
	const [ templateId, setidtemplateId ] = React.useState("");
	const [ contactId, setContactId ] = React.useState("");

	//end of state initlizations.

	const GetEmployees = gql`${querytosend}`;
	// console.log(GetEmployees);
	const { loading, error, data } = useQuery(GetEmployees);
	const handleChange = (event) => {
		setidtemplateId(event.target.value);
	};

	useEffect(
		() => {
			if (data != null) {
				setemployee(data.employees);
			}
		},
		[ data ]
	);

	//this method plays with closing the model that handles sending email to the selected user
	const handleCloseForEmail = () => {
		setOpenDialogForEmail(false);
	};

	//this method plays with closing the model that handles sending email to the selected user
	//it accepts the paramets of index
	const handleOpenDialogForEmail = (index) => {
		//now we are going to open sending email popup dialouge
		setOpenDialogForEmail(true);
	};

	//useEffect is a hook that get invokes when a components get loaded. we are calling
	//getAllEmployees function to load all Employees.
	useEffect(() => {
		let str = window.location.href;
		let id = str.replace(/.*\/(\w+)\/?$/, "$1");
		setContactId(id);
		getReleventContactQuery(id);
		getAllEmailTemplates();
	}, []);

	const getReleventContactQuery = async (id) => {
		//In try block, we will try to execute our logic if works fine.
		try {
			let response = await getContactById(id);
			let theQuery = response.query;
			setQuery(decodeURIComponent(theQuery));
			setQueryName(response.name);

			let decodedQuery = decodeURIComponent(theQuery);
			if (decodedQuery.includes("today")) {
				var regexp = /<(.*?)>/g;
				var regresults = decodedQuery.match(regexp);

				// By default the total number of days we will add is zero
				var totdays = 0;

				// If we find a match then we replace the zero value with the match value.
				if (regresults) {
					totdays = regresults[0];
				}

				// Now we need to do some clean up and remove the brackets so we only have the number
				var totdays01 = totdays.toString().replace("<", "");
				var totdays02 = totdays01.toString().replace(">", "");

				//For debugging we are displaying the total days in the console
				// console.log("totdays02: " + Number(totdays02));

				// Now we need to remove the brackets and the number from the graphql query because it will break our query.
				var querytosend01 = decodedQuery.replace(totdays, "");
				// get the current date
				var currentdate = new Date();
				// Add the number of days to the current date
				currentdate.setDate(currentdate.getDate() + Number(totdays02));
				var dateFormated = currentdate.toISOString().substr(0, 10);
				// Format the date so it matches what is expected inthe graphql query
				var querytosend02 = querytosend01.replace("today", dateFormated);
				SetQueryToSend(decodeURIComponent(querytosend02));
			} else {
				console.log(decodeURIComponent(theQuery));
				SetQueryToSend(decodeURIComponent(theQuery));
			}
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

	const getAllEmailTemplates = async () => {
		//In try block, we will try to execute our logic if works fine.
		try {
			let response = await getEmailTemplates();
			setEmailTemplates(response);
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

	//this function is responsible to send the emails.
	const sendEmails = async (e) => {
		e.preventDefault();
		//In try block, we will try to execute our logic if works fine.
		try {
			//we are initlization a receipts_emails array, as this name is present in
			//backend , we need to keep same names
			if (typeof from !== "undefined") {
				var pattern = new RegExp(
					/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
				);
				if (!pattern.test(from)) {
					toast.error(`Please enter valid email address`, {
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
			}

			let receipts_emails = [];
			for (let index = 0; index < employee.length; index++) {
				const element = employee[index];
				receipts_emails.push(element.email);
			}
			let currentTemplateObj = emailTemplates.filter((et) => {
				return et.id === templateId;
			});
			let subject = currentTemplateObj[0].subject;
			let text = currentTemplateObj[0].shortmessage;
			let htmlgen = currentTemplateObj[0].longmessage;
			//we sent the request to the method that was developed in mailService.

			toast.success(`Sending Email(s) to ${receipts_emails.length} Employee (s)... `, {
				position: "top-right",
				autoClose: 5000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				transition: Flip
			});
			let response = await sendAnEmail(receipts_emails, from, subject, text, htmlgen);
			//now we are checking if the status is 200, then we show success message and
			//clean the state to default values.
			if (response.status === 200) {
				toast.success(`Email (s) Sent Successfully!`, {
					position: "top-right",
					autoClose: 5000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,
					transition: Flip
				});
				setFrom("");
				setidtemplateId("");
				while (receipts_emails.length) {
					receipts_emails.pop();
				}
				//we closed the dialouge!
				handleCloseForEmail();
				return;
			}
		} catch (error) {
			//we closed the dialouge!
			handleCloseForEmail();
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
	//this check how many records should we show on page
	const handleLimitChange = (event) => {
		setLimit(event.target.value);
	};

	//this handle the page navigation etc inside a component
	const handlePageChange = (event, newPage) => {
		setPage(newPage);
	};

	//Here we are going to perform operation of Update An contact
	const updateQuery = async (e) => {
		e.preventDefault();
		try {
			let name = queryName;
			let response = await updateContact(contactId, name, encodeURIComponent(query));
			getReleventContactQuery(contactId);
			toast.success(`Contact/Query Updated Successfully!`, {
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

	//this is a part where we are rendering the End User Part that he sees.
	return (
		<div>
			<Box display="flex" className={clsx(classes.root, className)} justifyContent="flex-end">
				<Table>
					<tbody>
						<tr>
							<td>
								<Button
									style={{ float: "right" }}
									variant="contained"
									color="primary"
									onClick={updateQuery}
								>
									Update Query
								</Button>
							</td>
						</tr>
						<tr>
							<td style={{ paddingTop: 10 }}>
								<TextField
									className="mt-8 mb-8"
									label="Name of Query"
									autoFocus
									type="text"
									value={queryName}
									name="query"
									onChange={(e) => setQueryName(e.currentTarget.value)}
									placeholder="Name Of Query"
									variant="outlined"
									fullWidth
								/>
							</td>
						</tr>

						<tr>
							<td style={{ paddingTop: 10 }}>
								<TextField
									className="mt-8 mb-8"
									label="Query"
									autoFocus
									type="text"
									value={query}
									name="query"
									onChange={(e) => setQuery(e.currentTarget.value)}
									placeholder="Query"
									variant="outlined"
									fullWidth
									autoFocus
									multiline
									rows={6}
								/>
							</td>
						</tr>
						<tr>
							<td style={{ paddingTop: 10 }}>
								<TextField
									disabled
									className="mt-8 mb-8"
									label="Query Being Executed at fly!"
									autoFocus
									type="text"
									value={querytosend}
									name="querytosend"
									placeholder="Query on fly!"
									variant="outlined"
									fullWidth
								/>
							</td>
						</tr>
					</tbody>
				</Table>
			</Box>
			<br />

			<Card className={clsx(classes.root, className)} {...rest}>
				<div className={clsx(classes.root, className)} {...rest}>
					<Box display="flex" justifyContent="flex-end">
						{/* we have a diaglog here to show POPUP */}
						{/* To learn how to play with forms please check folowing link
          https://reactjs.org/docs/forms.html 
          ****WE ARE USING SOME MORE ADVANCED WAY TO DO THIS***
          */}
						<div className="p-24">
							<Dialog
								open={openDialogForEmail}
								onClose={handleCloseForEmail}
								aria-labelledby="form-dialog-title"
								classes={{
									paper: "rounded-8"
								}}
							>
								<DialogContent classes={{ root: "p-16 pb-0 sm:p-24 sm:pb-0" }}>
									<TextField
										style={{
											width: 200,
											height: 23
										}}
										className="mt-8 mb-16"
										label="From"
										id="from"
										type="email"
										value={from}
										name="from"
										onChange={(e) => setFrom(e.currentTarget.value)}
										variant="outlined"
										multiline
										rows={1}
										fullWidth
									/>
									<br /> <br />
									<br />
								</DialogContent>
								<FormControl
									style={{
										maxWidth: 192,
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
								</FormControl>
								{/* Buttons Area */}

								{/* select area */}

								<DialogActions className="justify-between p-8">
									<div className="px-16">
										<Button
											style={{ alignItems: "left", marginRight: 10 }}
											variant="contained"
											color="secondary"
											onClick={handleCloseForEmail}
										>
											Close
										</Button>
										<Button variant="contained" color="primary" onClick={sendEmails}>
											Send
										</Button>
									</div>
								</DialogActions>
								{/* </form> */}
							</Dialog>

							{/* BULK TAGS DIALOUGE */}
						</div>
					</Box>
				</div>

				<Box display="flex" justifyContent="flex-end">
					{/* This is a button on top right side to ask if a user wants to add an employee
         it triggers handleOpenDialog function */}
					<Button
						style={{ marginLeft: 5 }}
						color="primary"
						onClick={handleOpenDialogForEmail}
						variant="contained"
					>
						<EmailIcon />
						Send Email(s)
					</Button>
				</Box>

				{/* Here table area stats */}
				<PerfectScrollbar>
					<Box minWidth={1050}>
						<Table>
							<TableHead>
								<TableRow>
									{/* rendering of header area starts from here */}
									<TableCell>ID</TableCell>
									<TableCell>First Name</TableCell>
									<TableCell>Last Name</TableCell>
									<TableCell>Email</TableCell>

									{/* rendering of header area ends  here */}
								</TableRow>
							</TableHead>
							<TableBody key={page}>
								{
									employee.length > 0 ? employee
										.slice(page * limit, (page + 1) * limit)
										.map((emp, index) => (
											<TableRow hover key={emp.id}>
												<TableCell>
													<Box alignItems="center" display="flex">
														<Typography color="textPrimary" variant="body1">
															{emp.id}
														</Typography>
													</Box>
												</TableCell>
												<TableCell>{emp.firstname}</TableCell>
												<TableCell>{emp.lastname}</TableCell>
												<TableCell>{emp.email}</TableCell>

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
					count={employee.length}
					onChangePage={handlePageChange}
					onChangeRowsPerPage={handleLimitChange}
					page={page}
					rowsPerPage={limit}
					rowsPerPageOptions={[ 5, 10, 25 ]}
				/>
			</Card>
		</div>
	);
};

Results.propTypes = {
	className: PropTypes.string
};

//so boom! we exports this from here and consumes in Index.js to display to the potential pair
// of eyes
export default Results;
