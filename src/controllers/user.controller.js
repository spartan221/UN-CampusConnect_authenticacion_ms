import User from "../models/User";
import axios from "axios";
import { xml2json } from "xml-js";

// import File System Module
import fs from "fs"; 
  
// import xml2js Module
import { parseString } from "xml2js"; 

export const getUserInfo = async (req, res) => {
    const user = await User.findById(req.params.id).populate('role');
    const { id, username, email, role } = user;
    return res.status(200).json({id, username, email, role: role.name});
}

export const getMyPersonalInfo = async (req, res) => {
    const user = await User.findById(req.userId).populate('role');
    const { id, username, email, role, status } = user;
    return res.status(200).json({id, username, email, role: role.name, status});
}

export const getUsers = async (req, res) => {
    const usersFetched = await User.find().populate('role');
    const users = usersFetched.map((user) =>
    ({
        id: user.id,
        username: user.username, 
        email: user.email, 
        role: user.role.name,
        status: user.status
    }));
    return res.status(200).json(users);
}

export const getEmails = async (req, res) => {
    const usersFetched = await User.find().populate('role');
    const emails = usersFetched.filter((user) => user.role && user.role.name !== 'admin' && user.status === 'Active').map((user) => user.email);
    return res.status(200).json(emails);
    }

export const unsubscribe = async (req, res) => {
    const userId = req.userId;
    await User.findByIdAndDelete(userId);
    return res.status(200).json("your account has been deleted");
  };

export const getExternalUsers = async (req, res) => {
    const soapEnvelope =
        `<soapenv:Envelope xmlns:soapenv='http://schemas.xmlsoap.org/soap/envelope/' xmlns:your='your-namespace'><soapenv:Header/><soapenv:Body><your:getAllProfiles/></soapenv:Body></soapenv:Envelope>`
    const users = await axios.post('https://tutoacademy-int-rp-f-oadjztiq2a-uc.a.run.app/action', soapEnvelope, {
        headers: {
            'Content-Type': 'application/xml',
            'Accept': 'application/xml'
        }
    });
    const myJson = xml2json(users.data, {compact: true, spaces: 4});
    const numUsers = myJson.match(/tns:userId/g).length
    console.log(numUsers);

    return res.status(200).json({numUsers: numUsers});
}
  