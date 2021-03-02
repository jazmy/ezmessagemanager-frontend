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
//IconButton is being represented in Action tab
import IconButton from "@material-ui/core/IconButton";
//we are calling Delete,Edit and Email Icon here.
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import EmailIcon from "@material-ui/icons/Email";
//link to navigate
import { Link } from "react-router-dom";
//We are invoking different methods here that we developd in an 'employeeservice' before.
import {
	getEployees,
	deleteEployee,
	addAnEmployee,
	updateAnEmployee,
	updateAnEmployeeForBulkTags,
	getEployeesMetaFields,
	addAnEmployeeMetaData,
	updateEmployeeMetaData
} from "./employeeService";
//We are invoking sendAnEmail function from mailservice.
import { sendAnEmail } from "../../shared/mailService";
//mail templates
import { getEmailTemplates } from "./../../mailsdesigner/MailsDesignerView/mailTemplateService";
//tag service
import { getTags } from "./../../tags/TagsListView/tagsService";
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
	const [ employee, setemployee ] = useState([]);
	const [ theTags, settheTags ] = useState([]);
	const [ emailTemplates, setEmailTemplates ] = useState([]);
	const [ tags, setTags ] = useState([]);
	const [ flag, setFlag ] = useState(false);
	const [ empTags, setEmpTags ] = useState([]);
	const [ mode, setMode ] = useState("Add");
	const [ empId, setEmpId ] = useState();
	const [ firstname, setFirstName ] = useState("");
	const [ lastname, setLastName ] = useState("");
	const [ email, setEmail ] = useState("");
	const [ hiredate, setHireDate ] = useState("");
	const [ selectedEmployeeIds, setSelectedEmployeeIds ] = useState([]);
	const [ from, setFrom ] = useState([]);
	const [ limit, setLimit ] = useState(10);
	const [ page, setPage ] = useState(0);
	const [ openDialog, setOpenDialog ] = useState(false);
	const [ openDialogForEmail, setOpenDialogForEmail ] = useState(false);
	const [ openDialogForBulkTags, setOpenDialogForBulkTags ] = useState(false);

	//filter area starts
	const [ firstnameFil, setFirstNameFil ] = useState("");
	const [ lastnameFil, setLastNameFil ] = useState("");
	const [ emailFil, setEmailFil ] = useState("");
	const [ hireDateFil, setHireDateFil ] = useState("");
	const [ updatedDateFil, setUpdatedDateFil ] = useState("");
	const [ metaFields, setMetaFields ] = useState([]);
	const [ metaFieldsUpdate, setMetaFieldsUpdate ] = useState([]);

	//filter area ends
	//end of state initlizations.

	const [ templateId, setidtemplateId ] = React.useState("");
	const handleChange = (event) => {
		setidtemplateId(event.target.value);
	};

	//this method plays with closing the model that handles edit/add employees
	const handleClose = () => {
		while (empTags.length) {
			empTags.pop();
		}
		setMode("Add");
		setFirstName("");
		setLastName("");
		setEmail("");
		setHireDate("");
		getAlltheTags();
		setOpenDialog(false);
	};
	//this method plays with opening the model that handles edit/add employees
	const handleOpenDialog = () => {
		setOpenDialog(true);
	};

	//this method plays with closing the model that handles sending email to the selected user
	const handleCloseForEmail = () => {
		setOpenDialogForEmail(false);
	};

	//for bulk tags.
	const handleOpenForBulkTags = () => {
		setOpenDialogForBulkTags(true);
	};

	const handleCloseForBulkTags = () => {
		while (tags.length) {
			tags.pop();
		}
		setOpenDialogForBulkTags(false);
	};

	//this method plays with closing the model that handles sending email to the selected user
	//it accepts the paramets of index
	const handleOpenDialogForEmail = (index) => {
		//we are initilizing index equals to "i"
		let i = index;
		// we get obj back from "employees" by index number
		let obj = employee[i];
		// we set the email of a user
		setEmail(obj.email);
		//now we are going to open sending email popup dialouge
		setOpenDialogForEmail(true);
	};

	//useEffect is a hook that get invokes when a components get loaded. we are calling
	//getAllEmployees function to load all Employees.
	useEffect(() => {
		getAllEmployees();
		getAlltheTags();
		getAllEmailTemplates();
		getAllMetaFields();
	}, []);

	const getAllMetaFields = async () => {
		try {
			let response = await getEployeesMetaFields();
			setMetaFields(
				response.map((d) => {
					d.content = "";
					return d;
				})
			);
		} catch (error) {}
	};
	// this is our getAllEmployees function that get all users saved in Db
	const getAllEmployees = async () => {
		//In try block, we will try to execute our logic if works fine.
		try {
			let response = await getEployees();
			// we are setting employee equals to response of our functional Call.
			// Note:- We defined getEployees() in employeeService.
			setemployee(response);

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

	// this is our getAlltheTags function that get all users saved in Db
	const getAlltheTags = async () => {
		//In try block, we will try to execute our logic if works fine.
		try {
			let response = await getTags();
			// we are setting theTags equals to response of our functional Call.
			// Note:- We defined gettheTags() in theTagsService.
			settheTags(response);
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

	//this is a function to update the employee, it accepts the index
	const updateEmployee = (index) => {
		//In try block, we will try to execute our logic if works fine.
		try {
			let i = index;
			let obj = employee[i];
			setMetaFieldsUpdate(obj.employee_meta_data);
			let tagsOfAnEmployee = obj.tags;
			//we have two modes in our state, one is add, another one is "update", it sets to update
			//as we want to update now.
			setMode("Update");
			//set other required properties, that needs to populate.
			setEmpId(obj.id);
			setFirstName(obj.firstname);
			setLastName(obj.lastname);
			setEmail(obj.email);
			setHireDate(obj.hiredate);

			for (let index = 0; index < tagsOfAnEmployee.length; index++) {
				const element = tagsOfAnEmployee[index];
				empTags.push(element);
			}
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

	//to remove the tag

	const removeTag = (index) => {
		let i = index;
		let obj = empTags[i];
		let id = obj.id;
		let remained_tags = empTags.filter((et) => et.id !== id);
		setEmpTags(remained_tags);
	};
	//this function is responsible to send the emails.
	const sendEmails = async (e) => {
		e.preventDefault();
		//In try block, we will try to execute our logic if works fine.
		try {
			//we are initlization a receipts_emails array, as this name is present in
			//backend , we need to keep same names
			let receipts_emails = [];
			//we pushed the current email of our user to the receipts_emails
			receipts_emails.push(email);

			let currentTemplateObj = emailTemplates.filter((et) => {
				return et.id === templateId;
			});

			let subject = currentTemplateObj[0].subject;
			let text = currentTemplateObj[0].shortmessage;
			let htmlgen = currentTemplateObj[0].longmessage;
			//we sent the request to the method that was developed in mailService.

			toast.success(`Sending Email(s) to Employee (s)... `, {
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
				setEmail("");
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

	//this function get executed by submit button of add/update dialoge
	//this decide if should we call ADDEmployee OR Update Employee
	const operateFunction = (e) => {
		if (mode === "Add") {
			addEmployee(e);
		} else {
			//to update an employee
			// handleSubmit = Update Employee
			handleSubmit(e);
		}
	};

	//We are adding an Employee here.
	const addEmployee = async (e) => {
		e.preventDefault();
		const empMetaData = metaFields.map((field) => ({
			employeeMetaField_id: field.id,
			content: field.content,
			field_name: field.field_name
		}));

		let filteredEmpData = empMetaData.filter((eMD) => eMD.content != "");
		let responseFilteredEmpData = filteredEmpData.map((fE) => fE.employeeMetaField_id);
		try {
			//Here we are checking/validating email address format
			if (typeof email !== "undefined") {
				var pattern = new RegExp(
					/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
				);
				if (!pattern.test(email)) {
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

			let tagsToStore = [];
			for (let index = 0; index < tags.length; index++) {
				const element = tags[index];
				tagsToStore.push(element.id);
			}
			let employeeMetaData = responseFilteredEmpData;
			//if email pattern goes well, we are invoking addAnEmployee function, that was
			//developed in Service and sending the required params.
			let response = await addAnEmployee(firstname, lastname, email, hiredate, tagsToStore, employeeMetaData);
			//now we are checking if the status is 200, then we show success message and
			//clean the state to default values.

			if (response.status === 200) {
				if (empMetaData.length > 0) {
					let employee_id = response.data.id;
					for (let index = 0; index < empMetaData.length; index++) {
						const element = empMetaData[index];
						let employeeMetaField_id = element.employeeMetaField_id;
						let content = element.content;
						let field_name = element.field_name;
						await addAnEmployeeMetaData(employee_id, employeeMetaField_id, content, field_name);
						if (index === empMetaData.length - 1) {
							toast.success(`Employee Added Successfully!`, {
								position: "top-right",
								autoClose: 5000,
								hideProgressBar: false,
								closeOnClick: true,
								pauseOnHover: true,
								draggable: true,
								progress: undefined,
								transition: Flip
							});

							while (tags.length) {
								tags.pop();
							}
							handleClose();
							getAllEmployees();
							return;
						}
					}
				} else {
					toast.success(`Employee Added Successfully!`, {
						position: "top-right",
						autoClose: 5000,
						hideProgressBar: false,
						closeOnClick: true,
						pauseOnHover: true,
						draggable: true,
						progress: undefined,
						transition: Flip
					});

					while (tags.length) {
						tags.pop();
					}
					handleClose();
					getAllEmployees();
					return;
				}

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

	//Here we are going to perform operation of Update An Employee
	const handleSubmit = async (e) => {
		e.preventDefault();

		let metafieldsToUpdate = metaFieldsUpdate.map((field) => ({
			metaFieldId: field.id,
			content: field.content,
			empMfId: field.empMfId
		}));

		try {
			let tagsToStore = [];
			for (let index = 0; index < tags.length; index++) {
				const element = tags[index];
				tagsToStore.push(element.id);
			}

			for (let index = 0; index < empTags.length; index++) {
				const element = empTags[index];
				tagsToStore.push(element.id);
			}

			//now we are checking if the status is 200, then we show success message and
			//clean the state to default values.

			if (metafieldsToUpdate.length > 0) {
				for (let index = 0; index < metafieldsToUpdate.length; index++) {
					const element = metafieldsToUpdate[index];
					let metaDataId = element.metaFieldId;
					let content = element.content;
					await updateEmployeeMetaData(metaDataId, content);
					if (index === metafieldsToUpdate.length - 1) {
						console.log(metafieldsToUpdate);
						let filteredEmpData = metafieldsToUpdate.filter((eMD) => eMD.content != "");
						let responseFilteredEmpData = filteredEmpData.map((fE) => fE.empMfId);
						let employeeMetaData = responseFilteredEmpData;
						await updateAnEmployee(
							empId,
							firstname,
							lastname,
							email,
							hiredate,
							tagsToStore,
							employeeMetaData
						);
						toast.success(`Eployee Updated Successfully!`, {
							position: "top-right",
							autoClose: 5000,
							hideProgressBar: false,
							closeOnClick: true,
							pauseOnHover: true,
							draggable: true,
							progress: undefined,
							transition: Flip
						});
						getAllEmployees();
						setFirstName("");
						setLastName("");
						setEmail("");
						setHireDate("");
						while (tags.length) {
							tags.pop();
						}
						while (empTags.length) {
							empTags.pop();
						}
						setMode("Add");
						//fetch all latest Employees.
						getAllEmployees();
						//close the dialouge
						handleClose();
						return;
					}
				}
			} else {
				let employee_id = empId;
				const empMetaData = metaFields.map((field) => ({
					employeeMetaField_id: field.id,
					content: field.content,
					field_name: field.field_name
				}));
				let filteredEmpData = empMetaData.filter((eMD) => eMD.content != "");
				let responseFilteredEmpData = filteredEmpData.map((fE) => fE.employeeMetaField_id);
				let employeeMetaData = responseFilteredEmpData;

				for (let index = 0; index < empMetaData.length; index++) {
					const element = empMetaData[index];
					let employeeMetaField_id = element.employeeMetaField_id;
					let content = element.content;
					let field_name = element.field_name;
					await addAnEmployeeMetaData(employee_id, employeeMetaField_id, content, field_name);
					if (index === empMetaData.length - 1) {
						await updateAnEmployee(
							empId,
							firstname,
							lastname,
							email,
							hiredate,
							tagsToStore,
							employeeMetaData
						);
						toast.success(`Eployee Updated Successfully!`, {
							position: "top-right",
							autoClose: 5000,
							hideProgressBar: false,
							closeOnClick: true,
							pauseOnHover: true,
							draggable: true,
							progress: undefined,
							transition: Flip
						});
						getAllEmployees();
						setFirstName("");
						setLastName("");
						setEmail("");
						setHireDate("");
						while (tags.length) {
							tags.pop();
						}
						while (empTags.length) {
							empTags.pop();
						}
						setMode("Add");
						//fetch all latest Employees.
						getAllEmployees();
						//close the dialouge
						handleClose();
						return;
					}
				}
			}
		} catch (error) {
			console.log(error);
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

	//Here we are going to perform operation of deleet An Employee, this accepts index param...

	const deleteEmployee = async (index) => {
		try {
			let i = index;
			let obj = employee[i];
			//We are just confirming if a user really want to delete that guy?
			if (window.confirm(`Are you sure to delete ${obj.firstname.toUpperCase()}!`)) {
				//as we have the id of a user so we wil delete
				let id = obj.id;
				await deleteEployee(id);
				// after deleting that, we will filter our employee state, that is infact an
				//array type, to remove the deleted guy!
				let newemployee = employee.filter((emp) => emp.id !== id);
				toast.success(`Employee Deleted Successfully! `, {
					position: "top-right",
					autoClose: 5000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,
					transition: Flip
				});
				//we got new set of employee, so we will just re write it.
				setemployee(newemployee);
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
	const addTagToEmployee = (index) => {
		let i = index;
		let obj = theTags[i];
		tags.push(obj);
		let id = obj.id;
		let newtheTags = theTags.filter((tg) => tg.id !== id);
		settheTags(newtheTags);
	};

	// remove current tags
	const removeTagAndAddToTheTags = (index) => {
		let i = index;
		let obj = tags[i];
		theTags.push(obj);
		let id = obj.id;
		let newtags = tags.filter((tg) => tg.id !== id);
		setTags(newtags);
	};
	// remove current tags end
	//this was developed by theme provider so ignore this
	const handleSelectAll = (event) => {
		if (employee.length > 0) {
			let newSelectedEmployeeIds = [];

			if (event.target.checked) {
				newSelectedEmployeeIds =

						employee.length > 0 ? employee.map((emp) => emp.id) :
						null;
			} else {
				newSelectedEmployeeIds = [];
			}

			setSelectedEmployeeIds(newSelectedEmployeeIds);
			if (newSelectedEmployeeIds.length > 0) {
				setFlag(true);
			} else {
				setFlag(false);
			}
		}
	};

	const handleSelectOne = (event, id) => {
		const selectedIndex = selectedEmployeeIds.indexOf(id);

		let newSelectedEmployeeIds = [];

		if (selectedIndex === -1) {
			newSelectedEmployeeIds = newSelectedEmployeeIds.concat(selectedEmployeeIds, id);
		} else if (selectedIndex === 0) {
			newSelectedEmployeeIds = newSelectedEmployeeIds.concat(selectedEmployeeIds.slice(1));
		} else if (selectedIndex === selectedEmployeeIds.length - 1) {
			newSelectedEmployeeIds = newSelectedEmployeeIds.concat(selectedEmployeeIds.slice(0, -1));
		} else if (selectedIndex > 0) {
			newSelectedEmployeeIds = newSelectedEmployeeIds.concat(
				selectedEmployeeIds.slice(0, selectedIndex),
				selectedEmployeeIds.slice(selectedIndex + 1)
			);

			setSelectedEmployeeIds(newSelectedEmployeeIds);
			if (newSelectedEmployeeIds.length > 0) {
				setFlag(true);
			} else {
				setFlag(false);
			}
		}

		setSelectedEmployeeIds(newSelectedEmployeeIds);
		if (newSelectedEmployeeIds.length > 0) {
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
			if (confirm(`Are you sure to delete ${selectedEmployeeIds.length} Employee(s)`)) {
				for (let index = 0; index < selectedEmployeeIds.length; index++) {
					const element = selectedEmployeeIds[index];
					let id = element;
					await deleteEployee(id);
					if (index === selectedEmployeeIds.length - 1) {
						toast.success(`Selected Employee(s) Deleted Successfully`, {
							position: "top-right",
							autoClose: 5000,
							hideProgressBar: false,
							closeOnClick: true,
							pauseOnHover: true,
							draggable: true,
							progress: undefined,
							transition: Flip
						});
						getAllEmployees();
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

	//assigning bulk tags

	const assignTagsToEmployees = async () => {
		try {
			for (let index = 0; index < selectedEmployeeIds.length; index++) {
				const element = selectedEmployeeIds[index];
				let id = element;
				let emp = employee.filter((x) => {
					return x.id === id;
				});
				let CurrentTagsofEmp = emp[0].tags;
				let tagsToStore = [];
				for (let index = 0; index < tags.length; index++) {
					const element = tags[index];
					tagsToStore.push(element.id);
				}
				if (CurrentTagsofEmp.length > 0) {
					for (let index = 0; index < CurrentTagsofEmp.length; index++) {
						const element = CurrentTagsofEmp[index];
						tagsToStore.push(element.id);
					}
				}
				let empId = id;

				let response = await updateAnEmployeeForBulkTags(empId, tagsToStore);

				if (index === selectedEmployeeIds.length - 1) {
					toast.success(`Tags Assigned to the Employee(s) Successfully`, {
						position: "top-right",
						autoClose: 5000,
						hideProgressBar: false,
						closeOnClick: true,
						pauseOnHover: true,
						draggable: true,
						progress: undefined,
						transition: Flip
					});
					while (tags.length) {
						tags.pop();
					}
					while (empTags.length) {
						empTags.pop();
					}
					handleCloseForBulkTags();
					while (selectedEmployeeIds.length) {
						selectedEmployeeIds.pop();
					}
					setFlag(false);
					getAllEmployees();
					return;
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
				<p>
					<i className="fa fa-hand-o-right" aria-hidden="true" />Click on First Name to see detais!{" "}
				</p>
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
									rows={2}
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
													{eT.templatename} {eT.id}
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
				{
					flag ? <div>
						<Button style={{ color: "red" }} color="default" onClick={handleBulkDelete} variant="contained">
							<i className="fa fa-trash" aria-hidden="true" />
							Delete Selected Employee(s)
						</Button>
						<Button
							style={{ marginLeft: 5 }}
							color="primary"
							onClick={handleOpenForBulkTags}
							variant="contained"
						>
							<i className="fa fa-pencil" aria-hidden="true" />
							Add tags to Selected Employee(s)
						</Button>
					</div> :
					null}
				<Button style={{ marginLeft: 5 }} color="primary" onClick={handleOpenDialog} variant="contained">
					<i className="fa fa-plus" aria-hidden="true" />
					Add New Employee
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
								<Icon color="action">{mode} An Employee</Icon>
							</div>
							<br />
							<br />
							<TextField
								className="mb-12"
								label="First Name"
								autoFocus
								type="text"
								value={firstname}
								name="firstname"
								onChange={(e) => setFirstName(e.currentTarget.value)}
								placeholder="First Name"
								variant="outlined"
								fullWidth
							/>
							<br />
							<br />
							<TextField
								className="mb-12"
								label="Last Name"
								type="text"
								value={lastname}
								name="lastname"
								onChange={(e) => setLastName(e.currentTarget.value)}
								placeholder="Last Name"
								variant="outlined"
								fullWidth
							/>
							<br />
							<br />

							<TextField
								className="mb-12"
								label="Email"
								type="email"
								value={email}
								name="email"
								onChange={(e) => setEmail(e.currentTarget.value)}
								placeholder="Email"
								variant="outlined"
								fullWidth
							/>
							<br />
							<br />
						</div>

						<div className="flex">
							<div className="min-w-24 pt-10">
								<Icon color="action">Hired Date</Icon>
							</div>
							<TextField
								className="mb-12"
								type="date"
								value={hiredate}
								name="hiredate"
								onChange={(e) => setHireDate(e.currentTarget.value)}
								InputLabelProps={{
									shrink: true
								}}
								variant="outlined"
								fullWidth
							/>
						</div>

						{/* tags Area */}
						<br />
						{
							mode === "Add" ? metaFields.map((df) => (
								<Fragment key={df.id}>
									<TextField
										className="mb-12"
										label={df.field_name.toUpperCase()}
										type="text"
										value={df.content}
										name={df.field_name}
										onChange={(e) => {
											const newDynamicFields = metaFields.map((d) => {
												if (d.id == df.id) {
													d.content = e.currentTarget.value;
												}
												return d;
											});
											setMetaFields(newDynamicFields);
										}}
										placeholder={df.field_name.toUpperCase()}
										variant="outlined"
										fullWidth
									/>
									<br />
									<br />
								</Fragment>
							)) :
							metaFieldsUpdate.map((df) => (
								<Fragment key={df.id}>
									<TextField
										className="mb-12"
										label={df.field_name.toUpperCase()}
										type="text"
										value={df.content}
										name={df.field_name}
										onChange={(e) => {
											const newDynamicFields = metaFieldsUpdate.map((d) => {
												if (d.id == df.id) {
													d.content = e.currentTarget.value;
												}
												return d;
											});
											setMetaFieldsUpdate(newDynamicFields);
										}}
										placeholder={df.field_name.toUpperCase()}
										variant="outlined"
										fullWidth
									/>
									<br />
									<br />
								</Fragment>
							))}

						{
							mode === "Update" && metaFieldsUpdate.length < 1 ? metaFields.map((df) => (
								<Fragment key={df.id}>
									<TextField
										className="mb-12"
										label={df.field_name.toUpperCase()}
										type="text"
										value={df.content}
										name={df.field_name}
										onChange={(e) => {
											const newDynamicFields = metaFields.map((d) => {
												if (d.id == df.id) {
													d.content = e.currentTarget.value;
												}
												return d;
											});
											setMetaFields(newDynamicFields);
										}}
										placeholder={df.field_name.toUpperCase()}
										variant="outlined"
										fullWidth
									/>
									<br />
									<br />
								</Fragment>
							)) :
							null}

						<p>Current Tags of this employee.</p>
						{
							empTags.length > 0 ? empTags.map((etgg, index) => {
								return (
									<div
										key={index}
										style={{ cursor: "pointer" }}
										className="w3-tag w3-round w3-green w3-border w3-border-white"
										onClick={() => removeTag(index)}
									>
										{etgg.tag}
										<i className="far fa-times-circle" />
									</div>
								);
							}) :
							null}

						<br />

						<p>You have selected {tags.length} tag(s).</p>
						{
							(tags.length !== empTags) & (tags.length > 0) ? tags.map((tgg, index) => {
								return (
									<div
										key={index}
										style={{ cursor: "pointer" }}
										className="w3-tag w3-round w3-green w3-border w3-border-white"
										onClick={() => removeTagAndAddToTheTags(index)}
									>
										{tgg.tag}
										<i className="far fa-times-circle" />
									</div>
								);
							}) :
							null}

						<br />
						<p>{theTags.length} tag(s) are available to add! Please click to add.</p>
						{
							theTags.length > 0 ? theTags.map((tg, index) => {
								return (
									<div
										key={index}
										style={{ cursor: "pointer" }}
										className="w3-tag w3-round w3-green w3-border w3-border-white"
										onClick={() => addTagToEmployee(index)}
									>
										{tg.tag}
									</div>
								);
							}) :
							null}
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
								{mode} Employee
							</Button>
						</div>
					</DialogActions>
				</Dialog>
			</Box>

			{/* Dialoge for bulk tags */}
			<Dialog
				classes={{
					paper: "m-24 rounded-8"
				}}
				open={openDialogForBulkTags}
				onClose={handleCloseForBulkTags}
				aria-labelledby="form-dialog-title"
				fullWidth
				maxWidth="sm"
			>
				<DialogContent classes={{ root: "p-24" }}>
					<div className="flex">
						<div className="min-w-24 pt-10">
							<Icon color="action">Assign Tags to Selected Employee(s)</Icon>
						</div>
					</div>

					{/* tags Area */}

					<p>You have selected {tags.length} tag(s).</p>
					{
						tags.length > 0 ? tags.map((tgg, index) => {
							return (
								<div
									key={index}
									style={{ cursor: "pointer" }}
									className="w3-tag w3-round w3-green w3-border w3-border-white"
									onClick={() => removeTagAndAddToTheTags(index)}
								>
									{tgg.tag}
									<i className="far fa-times-circle" />
								</div>
							);
						}) :
						null}

					<br />
					<p>{theTags.length} tag(s) are available to add! Please click to add.</p>
					{
						theTags.length > 0 ? theTags.map((tg, index) => {
							return (
								<div
									key={index}
									style={{ cursor: "pointer" }}
									className="w3-tag w3-round w3-green w3-border w3-border-white"
									onClick={() => addTagToEmployee(index)}
								>
									{tg.tag}
								</div>
							);
						}) :
						null}
				</DialogContent>
				<DialogActions className="justify-between p-8">
					{/* Buttons Area */}
					<div className="px-16">
						<Button
							style={{ alignItems: "left", marginRight: 10 }}
							variant="contained"
							color="secondary"
							onClick={handleCloseForBulkTags}
						>
							Close
						</Button>

						<Button variant="contained" color="primary" onClick={assignTagsToEmployees} type="submit">
							Assign Tags to {selectedEmployeeIds.length} Employee(s)
						</Button>
					</div>
				</DialogActions>
			</Dialog>

			{/* Here table area stats */}
			<PerfectScrollbar>
				<Box minWidth={1050}>
					<Table>
						<TableHead>
							<TableRow>
								{/* This was developed by UI provider, so ignore that, we might need that in future */}
								<TableCell padding="checkbox">
									<Checkbox
										checked={selectedEmployeeIds.length === employee.length}
										color="primary"
										indeterminate={
											selectedEmployeeIds.length > 0 &&
											selectedEmployeeIds.length < employee.length
										}
										onChange={handleSelectAll}
									/>
								</TableCell>
								{/* rendering of header area starts from here */}
								<TableCell>
									First Name
									<input
										autoFocus
										placeholder="Filter"
										className="input-Style-For-Emp"
										type="text"
										value={firstnameFil}
										onChange={(event) => {
											setFirstNameFil(event.target.value);
										}}
									/>
								</TableCell>

								<TableCell>
									Last Name
									<input
										className="input-Style-For-Emp"
										type="text"
										value={lastnameFil}
										onChange={(event) => {
											setLastNameFil(event.target.value);
										}}
									/>
								</TableCell>

								<TableCell>
									Email
									<input
										className="input-Style-For-Emp"
										type="text"
										value={emailFil}
										onChange={(event) => {
											setEmailFil(event.target.value);
										}}
									/>
								</TableCell>
								<TableCell>
									Hire Date
									<input
										className="input-Style-For-Emp"
										type="text"
										value={hireDateFil}
										onChange={(event) => {
											setHireDateFil(event.target.value);
										}}
									/>
								</TableCell>

								<TableCell>
									Last Updated
									<input
										className="input-Style-For-Emp"
										type="text"
										value={updatedDateFil}
										onChange={(event) => {
											setUpdatedDateFil(event.target.value);
										}}
									/>
								</TableCell>
								<TableCell>Tags</TableCell>
								<TableCell>Action</TableCell>
								{/* rendering of header area ends  here */}
							</TableRow>
						</TableHead>

						{/* BODY OF TABLE STARTS FROM HERE
             =>we check that id length of an employee array is greater than zero, then
            =>we renders/ map it else, we return null to avoide potentially errors 
            */}
						{/* {console.log(employee)} */}
						<TableBody key={page}>
							{
								employee.length > 0 ? employee
									.slice(page * limit, (page + 1) * limit)
									.filter((val) => {
										if (
											firstnameFil === "" &&
											lastnameFil === "" &&
											emailFil === "" &&
											hireDateFil === "" &&
											updatedDateFil === ""
										) {
											return val;
										} else if (
											val.firstname.toLowerCase().includes(firstnameFil.toLowerCase()) &&
											val.lastname.toLowerCase().includes(lastnameFil.toLowerCase()) &&
											val.email.toLowerCase().includes(emailFil.toLowerCase()) &&
											val.hiredate.toLowerCase().includes(hireDateFil.toLowerCase()) &&
											val.updated_at.toLowerCase().includes(updatedDateFil.toLowerCase())
										) {
											return val;
										}
									})
									.map((emp, index) => (
										<TableRow
											hover
											key={emp.id}
											selected={selectedEmployeeIds.indexOf(emp.id) !== -1}
										>
											<TableCell padding="checkbox">
												<Checkbox
													checked={selectedEmployeeIds.indexOf(emp.id) !== -1}
													onChange={(event) => handleSelectOne(event, emp.id)}
													value="true"
												/>
											</TableCell>
											<TableCell>
												<Box alignItems="center" display="flex">
													<Typography color="textPrimary" variant="body1">
														<Link to={`/app/employee-details/${emp.id}`}>
															{emp.firstname}
														</Link>
													</Typography>
												</Box>
											</TableCell>

											<TableCell>{emp.lastname}</TableCell>
											<TableCell>{emp.email}</TableCell>
											{/* Here we are using moment to display date in beautiful form */}
											<TableCell>{moment(emp.hiredate).format("DD/MM/YYYY")}</TableCell>
											<TableCell>{moment(emp.updated_at).format("DD/MM/YYYY")}</TableCell>
											<TableCell>
												{emp.tags.map((emptag, index) => {
													return (
														<div
															key={index}
															style={{ cursor: "pointer" }}
															className="w3-tag w3-round w3-green w3-border w3-border-white"
														>
															{emptag.tag}
														</div>
													);
												})}
											</TableCell>
											{/* Buttons area to send email/edit/delete starts from here */}
											<TableCell>
												<IconButton
													aria-label="Update"
													onClick={() => handleOpenDialogForEmail(index)}
													className={classes.margin}
												>
													<EmailIcon />
												</IconButton>
												<IconButton
													aria-label="Update"
													onClick={() => updateEmployee(index)}
													className={classes.margin}
												>
													<EditIcon />
												</IconButton>

												<IconButton
													aria-label="delete"
													onClick={() => deleteEmployee(index)}
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
				count={employee.length}
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
