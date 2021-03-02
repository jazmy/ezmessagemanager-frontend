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
import { getContacts } from "../../contactList/contactListView/contactService";
import {
	addSchedule,
	getAllSlackSchedules,
	updateSlackSchedulesById,
	deleteSlackSchedulesById,
	refresh_cron
} from "./slackScheduleService";
//mail teslates
import { getEmailTemplates } from "../../mailsdesigner/MailsDesignerView/mailTemplateService";
//tag service
//toast
import { toast, Flip } from "react-toastify";
//timezone select
import TimezoneSelect from "react-timezone-select";
//we are calling Delete,Edit Icon here.
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";

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
	FormControlLabel
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

	const [ selectedSlackSchedulesIds, setselectedSlackSchedulesIds ] = useState([]);
	const [ SlackSchedules, setSlackSchedules ] = useState([]);
	const [ allContacts, setAllContacts ] = useState([]);
	const [ contactId, setContactId ] = useState("");
	const [ EmailTemplates, setEmailTemplates ] = useState([]);
	const [ limit, setLimit ] = useState(10);
	const [ selectedTimezone, setSelectedTimezone ] = useState({
		abbrev: "MST",
		altName: "Mountain Standard Time",
		label: "(GMT-7:00) Arizona",
		value: "America/Phoenix"
	});
	const [ startdate, setStartDate ] = useState("");
	const [ SlackSchId, setSlackSchId ] = useState("");
	const [ enddate, setEndDate ] = useState("");
	const [ date, setDate ] = useState("");
	const [ time, setTime ] = useState("");
	const [ page, setPage ] = useState(0);
	const [ flag, setFlag ] = useState(false);
	const [ openDialog, setOpenDialog ] = useState(false);
	const [ openDialogForUpdate, setOpenDialogForUpdate ] = useState(false);
	const [ templateId, setTemplateId ] = useState("");
	const [ SlackDays, setSlackDays ] = useState([]);
	//end of state initlizations.
	const handleChangeForTemplateId = (event) => {
		setTemplateId(event.target.value);
	};
	const handleChangeForContactId = (event) => {
		setContactId(event.target.value);
	};

	const handleCheckboxChange = (event) => {
		let newArray = [ ...SlackDays, event.target.id ];
		if (SlackDays.includes(event.target.id)) {
			newArray = newArray.filter((day) => day !== event.target.id);
		}
		setSlackDays(newArray);
	};

	const getDaysBetweenDates = (start, end, dayName) => {
		var result = [];
		var days = { sun: 0, mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6 };
		var day = days[dayName.toLowerCase().substr(0, 3)];
		// Copy start date
		var current = new Date(start);
		// Shift to next of required days
		current.setDate(current.getDate() + (day - current.getDay() + 7) % 7);
		// While less than end date, add dates to result array
		while (current < end) {
			result.push(new Date(+current));
			current.setDate(current.getDate() + 7);
		}

		let dates = [];
		for (let index = 0; index < result.length; index++) {
			const element = result[index];
			// console.log(element);
			let date = new Date(element);
			let mnth = ("0" + (date.getMonth() + 1)).slice(-2);
			let the_day = ("0" + date.getDate()).slice(-2);
			let res = [ date.getFullYear(), mnth, the_day ].join("-");
			dates.push(res);
		}
		return dates;
	};

	const handleOpen = () => {
		//now we are going to open sending Slack popup dialouge
		setOpenDialog(true);
	};
	//this method plays with closing the model that handles sending Slack to the selected user
	const handleClose = () => {
		setTemplateId(EmailTemplates[0].id);
		setContactId(allContacts[0].id);
		setStartDate("");
		setEndDate("");
		setTime("");
		while (SlackDays.length) {
			SlackDays.pop();
		}

		setSelectedTimezone({
			abbrev: "MST",
			altName: "Mountain Standard Time",
			label: "(GMT-7:00) Arizona",
			value: "America/Phoenix"
		});

		setOpenDialog(false);
	};

	const handleOpenForUpdate = () => {
		setOpenDialogForUpdate(true);
	};
	//this method plays with closing the model that handles sending Slack to the selected user
	const handleCloseForUpdate = () => {
		setTemplateId(EmailTemplates[0].id);
		setContactId(allContacts[0].id);
		setStartDate("");
		setEndDate("");
		setTime("");

		setSelectedTimezone({
			abbrev: "MST",
			altName: "Mountain Standard Time",
			label: "(GMT-7:00) Arizona",
			value: "America/Phoenix"
		});
		setOpenDialogForUpdate(false);
	};

	//useEffect is a hook that get invokes when a components get loaded. we are calling
	//getAllSlackscheduless function to load all Slackscheduless.
	useEffect(() => {
		getSlackSchedules();
		getAllEmailTemplatesFromService();
		getAllContactsFromService();
	}, []);
	const getAllContactsFromService = async () => {
		//In try block, we will try to execute our logic if works fine.
		try {
			let response = await getContacts();
			setContactId(response[0].id);
			setAllContacts(response);
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

	const scheduleSlacksSchedule = async () => {
		if (startdate === "" || enddate === "") {
			alert("Start Date or Ending Date is missing!");
			return;
		}
		let emailtemplate_id = templateId;
		let contactlist_id = contactId;
		if (startdate === enddate) {
			let thedate = new Date(startdate);
			let mnth = ("0" + (thedate.getMonth() + 1)).slice(-2);
			let the_day = ("0" + thedate.getDate()).slice(-2);
			let date = [ thedate.getFullYear(), mnth, the_day ].join("-");

			let responseback = await addSchedule(
				emailtemplate_id,
				contactlist_id,
				date,
				encodeURIComponent(JSON.stringify(selectedTimezone)),
				time
			);

			toast.success(`Slack(s) have been scheduled Successfully!`, {
				position: "top-right",
				autoClose: 5000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				transition: Flip
			});
			getSlackSchedules();

			handleClose();
			await refresh_cron();
		} else {
			for (let index = 0; index < SlackDays.length; index++) {
				const theday = SlackDays[index];
				let response = getDaysBetweenDates(new Date(startdate), new Date(enddate), theday);

				let contactlist_id = contactId;
				for (let index = 0; index < response.length; index++) {
					const date = response[index];
					let responseback = await addSchedule(
						emailtemplate_id,
						contactlist_id,
						date,
						encodeURIComponent(JSON.stringify(selectedTimezone)),
						time
					);
				}
				if (index === SlackDays.length - 1) {
					toast.success(`Slack Message(s) have been scheduled Successfully!`, {
						position: "top-right",
						autoClose: 5000,
						hideProgressBar: false,
						closeOnClick: true,
						pauseOnHover: true,
						draggable: true,
						progress: undefined,
						transition: Flip
					});
					getSlackSchedules();
					handleClose();
					await refresh_cron();
					return;
				}
			}
		}
	};
	const getAllEmailTemplatesFromService = async () => {
		//In try block, we will try to execute our logic if works fine.
		try {
			let response = await getEmailTemplates();
			setTemplateId(response[0].id);
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

	const getSlackSchedules = async () => {
		//In try block, we will try to execute our logic if works fine.
		try {
			let response = await getAllSlackSchedules();
			setSlackSchedules(response);
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

	const updateSlackSchedules = async (index) => {
		try {
			let slackSchArray = SlackSchedules;
			let obj = slackSchArray.filter((item) => {
				return item.id == index;
			});

			handleOpenForUpdate();
			setSlackSchId(obj[0].id);
			setContactId(obj[0].contactlist_id);
			setDate(obj[0].date);
			setTemplateId(obj[0].emailtemplate_id);
			setTime(obj[0].time);
			let timezone = JSON.parse(decodeURIComponent(obj[0].timezone));
			setSelectedTimezone(timezone);
		} catch (error) {
			// console.log(error);
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

	const handleSubmitUpdate = async () => {
		try {
			let emailtemplate_id = templateId;
			let contactlist_id = contactId;
			let response = await updateSlackSchedulesById(
				SlackSchId,
				emailtemplate_id,
				contactlist_id,
				date,
				encodeURIComponent(JSON.stringify(selectedTimezone)),
				time
			);

			if (response.status === 200) {
				handleCloseForUpdate();
				getSlackSchedules();
				toast.success(`Slack Message Schedule has been updated successfully`, {
					position: "top-right",
					autoClose: 5000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,
					transition: Flip
				});
				await refresh_cron();
				return;
			}
		} catch (error) {
			console.log(error);
			handleCloseForUpdate();
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
	//this check how many records should we show on page
	const handleLimitChange = (event) => {
		setLimit(event.target.value);
	};

	//this handle the page navigation etc inside a component
	const handlePageChange = (event, newPage) => {
		setPage(newPage);
	};

	const handleSelectAll = (event) => {
		if (SlackSchedules.length > 0) {
			let newselectedSlackSchedulesIds = [];

			if (event.target.checked) {
				newselectedSlackSchedulesIds =

						SlackSchedules.length > 0 ? SlackSchedules.map((es) => es.id) :
						null;
			} else {
				newselectedSlackSchedulesIds = [];
			}
			setselectedSlackSchedulesIds(newselectedSlackSchedulesIds);
			if (newselectedSlackSchedulesIds.length > 0) {
				setFlag(true);
			} else {
				setFlag(false);
			}
		}
	};

	const handleSelectOne = (event, id) => {
		const selectedIndex = selectedSlackSchedulesIds.indexOf(id);

		let newselectedSlackSchedulesIds = [];

		if (selectedIndex === -1) {
			newselectedSlackSchedulesIds = newselectedSlackSchedulesIds.concat(selectedSlackSchedulesIds, id);
		} else if (selectedIndex === 0) {
			newselectedSlackSchedulesIds = newselectedSlackSchedulesIds.concat(selectedSlackSchedulesIds.slice(1));
		} else if (selectedIndex === selectedEmployeeIds.length - 1) {
			newselectedSlackSchedulesIds = newselectedSlackSchedulesIds.concat(selectedSlackSchedulesIds.slice(0, -1));
		} else if (selectedIndex > 0) {
			newselectedSlackSchedulesIds = newselectedSlackSchedulesIds.concat(
				selectedSlackSchedulesIds.slice(0, selectedIndex),
				selectedSlackSchedulesIds.slice(selectedIndex + 1)
			);
		}
		setselectedSlackSchedulesIds(newselectedSlackSchedulesIds);
		if (newselectedSlackSchedulesIds.length > 0) {
			setFlag(true);
		} else {
			setFlag(false);
		}
	};

	const returnTimeZone = (es) => {
		let time_zone = JSON.parse(decodeURIComponent(es.timezone));
		return <span>{time_zone.label}</span>;
	};
	const handleBulkDelete = async () => {
		try {
			if (confirm(`Are you sure to delete ${selectedSlackSchedulesIds.length} Slack Message Schedule(s)`)) {
				for (let index = 0; index < selectedSlackSchedulesIds.length; index++) {
					const element = selectedSlackSchedulesIds[index];
					let id = element;
					await deleteSlackSchedulesById(id);
					if (index === selectedSlackSchedulesIds.length - 1) {
						getSlackSchedules();
						toast.success(`Selected Slack Message Schedule(s) Deleted Successfully`, {
							position: "top-right",
							autoClose: 5000,
							hideProgressBar: false,
							closeOnClick: true,
							pauseOnHover: true,
							draggable: true,
							progress: undefined,
							transition: Flip
						});
						await refresh_cron();
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

	const deleteSlackSchedules = async (index) => {
		try {
			let slackSchArray = SlackSchedules;
			let obj = slackSchArray.filter((item) => {
				return item.id == index;
			});

			let id = obj[0].id;

			await deleteSlackSchedulesById(id);

			let newlistofSlackSch = SlackSchedules.filter((eS) => eS.id !== id);
			setSlackSchedules(newlistofSlackSch);

			toast.success(`Selected Slack Message Schedule Deleted Successfully`, {
				position: "top-right",
				autoClose: 5000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				transition: Flip
			});
			await refresh_cron();
			return;
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
					<div style={{ maxWidth: 1600 }}>
						<div className="p-24">
							<Dialog
								open={openDialog}
								onClose={handleClose}
								aria-labelledby="form-dialog-title"
								classes={{
									paper: "rounded-8"
								}}
								fullWidth={true}
								maxWidth={"sm"}
							>
								<br />
								<div style={{ marginLeft: 22 }} className="min-w-24 pt-10">
									<Icon color="action"> Add Schedule</Icon>
								</div>
								<DialogContent>
									<div className="flex">
										<InputLabel id="demo-simple-select-helper-label">
											Select Email Template (Short Message would be sent as a message)
										</InputLabel>
										<Select
											className="mt-8 mb-60"
											labelId="demo-simple-select-helper-label"
											id="demo-simple-select-helper"
											value={templateId}
											onChange={handleChangeForTemplateId}
											fullWidth
										>
											{
												EmailTemplates.length > 0 ? EmailTemplates.map((eT, index) => {
													return (
														<MenuItem key={index} value={eT.id}>
															{eT.templatename}
														</MenuItem>
													);
												}) :
												null}
										</Select>
									</div>
									<br />
									<div>
										<Select
											className="mt-8 mb-60"
											labelId="demo-simple-select-helper-label"
											id="demo-simple-select-helper"
											value={contactId}
											onChange={handleChangeForContactId}
											fullWidth
										>
											{
												allContacts.length > 0 ? allContacts.map((aC, index) => {
													return (
														<MenuItem key={index} value={aC.id}>
															{aC.name}
														</MenuItem>
													);
												}) :
												null}
										</Select>
									</div>

									<div className="flex">
										<br />
										<div className="min-w-24 pt-10">
											<Icon color="action">Time Zone</Icon>
										</div>
										<TimezoneSelect value={selectedTimezone} onChange={setSelectedTimezone} />
									</div>
									<br />
									<div className="flex">
										<div className="min-w-24 pt-10">
											<Icon color="action">Start Date</Icon>
										</div>
										<TextField
											className="mb-12"
											type="date"
											value={startdate}
											name="startdate"
											onChange={(e) => setStartDate(e.currentTarget.value)}
											InputLabelProps={{
												shrink: true
											}}
											variant="outlined"
											fullWidth
										/>
									</div>

									<div className="flex">
										<div className="min-w-24 pt-10">
											<Icon color="action">End Date</Icon>
										</div>
										<TextField
											className="mb-12"
											type="date"
											value={enddate}
											name="enddate"
											onChange={(e) => setEndDate(e.currentTarget.value)}
											InputLabelProps={{
												shrink: true
											}}
											variant="outlined"
											fullWidth
										/>
									</div>

									<div className="flex">
										<div className="min-w-24 pt-10">
											<Icon color="action">Time</Icon>
										</div>
										<TextField
											className="mb-12"
											type="time"
											value={time}
											name="time"
											onChange={(e) => setTime(e.currentTarget.value)}
											InputLabelProps={{
												shrink: true
											}}
											variant="outlined"
											fullWidth
										/>
									</div>

									<div className="flex">
										<div className="min-w-24 pt-10">
											<Icon color="action">Days</Icon>
										</div>

										<FormControlLabel
											control={
												<Checkbox
													onChange={handleCheckboxChange}
													id="mon"
													name="mon"
													value="mon"
													color="primary"
												/>
											}
											label="Monday"
										/>
										<FormControlLabel
											control={
												<Checkbox
													onChange={handleCheckboxChange}
													id="tue"
													name="tue"
													value="tue"
													// indeterminate
													color="primary"
												/>
											}
											label="Tuesday"
										/>
										<FormControlLabel
											control={
												<Checkbox
													onChange={handleCheckboxChange}
													id="wed"
													name="wed"
													value="wed"
													// indeterminate
													color="primary"
												/>
											}
											label="Wednesday"
										/>
										<FormControlLabel
											control={
												<Checkbox
													onChange={handleCheckboxChange}
													id="thu"
													name="thu"
													value="thu"
													color="primary"
												/>
											}
											label="Thursday"
										/>
										<FormControlLabel
											control={
												<Checkbox
													onChange={handleCheckboxChange}
													id="fri"
													name="fri"
													value="fri"
													color="primary"
												/>
											}
											label="Friday"
										/>
										<FormControlLabel
											control={
												<Checkbox
													onChange={handleCheckboxChange}
													id="sat"
													name="sat"
													value="sat"
													color="primary"
												/>
											}
											label="Saturday"
										/>
										<FormControlLabel
											control={
												<Checkbox
													onChange={handleCheckboxChange}
													id="sun"
													name="sun"
													value="sun"
													color="primary"
												/>
											}
											label="Sunday"
										/>
									</div>

									<DialogActions className="justify-between p-8">
										<br />
										<br />
										<div className="px-16">
											<Button
												style={{ alignItems: "left", marginRight: 10 }}
												variant="contained"
												color="secondary"
												onClick={handleClose}
											>
												Close
											</Button>
											<Button
												variant="contained"
												color="primary"
												onClick={scheduleSlacksSchedule}
											>
												Schedule
											</Button>
										</div>
									</DialogActions>

									{/* </form> */}
								</DialogContent>
							</Dialog>
						</div>
					</div>

					{/* FOR UPDATE */}
					<div style={{ maxWidth: 1600 }}>
						<div className="p-24">
							<Dialog
								open={openDialogForUpdate}
								onClose={handleCloseForUpdate}
								aria-labelledby="form-dialog-title"
								classes={{
									paper: "rounded-8"
								}}
								fullWidth={true}
								maxWidth={"sm"}
							>
								<DialogContent classes={{ root: "p-12" }}>
									<br />
									<div className="min-w-24 pt-10">
										<Icon color="action"> Update Schedule</Icon>
									</div>
									<br />
									<div className="flex">
										<InputLabel id="demo-simple-select-helper-label">
											Select Slack Template
										</InputLabel>
										<Select
											className="mt-8 mb-60"
											labelId="demo-simple-select-helper-label"
											id="demo-simple-select-helper"
											value={templateId}
											onChange={handleChangeForTemplateId}
											fullWidth
										>
											{
												EmailTemplates.length > 0 ? EmailTemplates.map((eT, index) => {
													return (
														<MenuItem key={index} value={eT.id}>
															{eT.templatename}
														</MenuItem>
													);
												}) :
												null}
										</Select>
									</div>
									<br />
									<div className="flex">
										<InputLabel id="demo-simple-select-helper-label">
											Select Contact List
										</InputLabel>

										<Select
											className="mt-8 mb-60"
											labelId="demo-simple-select-helper-label"
											id="demo-simple-select-helper"
											value={contactId}
											onChange={handleChangeForContactId}
											fullWidth
										>
											{
												allContacts.length > 0 ? allContacts.map((aC, index) => {
													return (
														<MenuItem key={index} value={aC.id}>
															{aC.name}
														</MenuItem>
													);
												}) :
												null}
										</Select>
									</div>

									<br />
									<div className="flex">
										<div className="min-w-24 pt-10">
											<Icon color="action">Time Zone</Icon>
										</div>
										<TimezoneSelect value={selectedTimezone} onChange={setSelectedTimezone} />
									</div>
									<br />
									<div className="flex">
										<div className="min-w-24 pt-10">
											<Icon color="action">Date Scheduled</Icon>
										</div>
										<TextField
											className="mb-12"
											type="date"
											value={date}
											name="date"
											onChange={(e) => setDate(e.currentTarget.value)}
											InputLabelProps={{
												shrink: true
											}}
											variant="outlined"
											fullWidth
										/>
									</div>

									<div className="flex">
										<div className="min-w-24 pt-10">
											<Icon color="action">Time</Icon>
										</div>
										<TextField
											className="mb-12"
											type="time"
											value={time}
											name="time"
											onChange={(e) => setTime(e.currentTarget.value)}
											InputLabelProps={{
												shrink: true
											}}
											variant="outlined"
											fullWidth
										/>
									</div>

									<DialogActions className="justify-between p-8">
										<br />
										<br /> <br />
										<div className="px-16">
											<Button
												style={{ alignItems: "left", marginRight: 10 }}
												variant="contained"
												color="secondary"
												onClick={handleCloseForUpdate}
											>
												Close
											</Button>
											<Button variant="contained" color="primary" onClick={handleSubmitUpdate}>
												Update Schedule
											</Button>
										</div>
									</DialogActions>
								</DialogContent>
							</Dialog>
						</div>
					</div>
				</Box>
			</div>

			<Box display="flex" justifyContent="flex-end">
				{/* This is a button on top right side to ask if a user wants to add an SlackSchedules
         it triggers handleOpen function */}
				{
					flag ? <div>
						<Button style={{ color: "red" }} color="default" onClick={handleBulkDelete} variant="contained">
							<i className="fa fa-trash" aria-hidden="true" />
							Delete Selected Slack Message Schedules(s)
						</Button>
					</div> :
					null}
				<Button style={{ marginLeft: 5 }} color="primary" onClick={handleOpen} variant="contained">
					<i className="fa fa-plus" aria-hidden="true" />
					Schedule New Slacks
				</Button>
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
										checked={selectedSlackSchedulesIds.length === SlackSchedules.length}
										color="primary"
										indeterminate={
											selectedSlackSchedulesIds.length > 0 &&
											selectedSlackSchedulesIds.length < SlackSchedules.length
										}
										onChange={handleSelectAll}
									/>
								</TableCell>
								{/* rendering of header area starts from here */}
								<TableCell>Scheduled Slacks</TableCell>
								<TableCell>Status</TableCell>
								<TableCell>Action</TableCell>
							</TableRow>
						</TableHead>

						<TableBody key={page}>
							{
								SlackSchedules.length > 0 ? SlackSchedules.slice(
									page * limit,
									(page + 1) * limit
								).map((es, index) => (
									<TableRow
										hover
										key={es.id}
										selected={selectedSlackSchedulesIds.indexOf(es.id) !== -1}
									>
										<TableCell padding="checkbox">
											<Checkbox
												checked={selectedSlackSchedulesIds.indexOf(es.id) !== -1}
												onChange={(event) => handleSelectOne(event, es.id)}
												value="true"
											/>
										</TableCell>
										<TableCell>
											<Box alignItems="center" display="flex">
												<Typography color="textPrimary" variant="body1">
													{moment(es.date).format("DD/MM/YYYY")} at {""} {""}{" "}
													{moment(es.time, [ "hh:mm" ]).format("hh:mm A")} {""}{" "}
													{returnTimeZone(es)} Time Zone
												</Typography>
											</Box>
										</TableCell>
										<TableCell>
											{
												es.completed === true ? "Compeleted" :
												"Pending"}
										</TableCell>

										<TableCell>
											<IconButton
												aria-label="Update"
												onClick={() => updateSlackSchedules(es.id)}
												className={classes.margin}
											>
												<EditIcon />
											</IconButton>

											<IconButton
												aria-label="delete"
												onClick={() => deleteSlackSchedules(es.id)}
												className={classes.margin}
											>
												<DeleteIcon />
											</IconButton>
											{/* Buttons area to send Slack/edit/delete starts ends here */}
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
				count={SlackSchedules.length}
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
