//We are importing axios library here, this is use to send/get requests to server
import axios from "axios";

//We are initilizing a variable "SERVER_URL" component here, that is getting value
//variable by using "process.env"
let SERVER_URL = process.env.REACT_APP_SERVER_URL;

//***this method will send a get request to get  Employee of our choice***
export const getEployeeById = async (id) => {
	//In try block, we will try to execute our logic if works fine.
	try {
		const response = await axios.get(`${SERVER_URL}Employees/${id}`, {
			headers: { Authorization: `Bearer ${localStorage.getItem("x-auth-token")}` }
		});

		//we are getting response back from server and storing in variable named as "data"
		const data = await response.data;

		//here we are returing our variable that we will listen from the components
		// by which this service is being called.
		return data;
	} catch (error) {
		console.log(error);

		//here we are catching the error, and returning it.
		return error;
	}
};