import React, { useRef } from "react";
import {
  collection,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
} from "@firebase/firestore";
import db from "../firebase";
import Cookies from "universal-cookie";

import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const cookies = new Cookies();

const UsersCollectionRef = collection(db, "users");

function PPModal(props) {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute w-full h-full bg-black opacity-50"></div>

      {/* Modal */}
      <div className="absolute max-w-2xl rounded-lg shadow-xl bg-gray-50">
        <div className="m-4">
          <label className="inline-block mb-2 text-gray-500">File Upload</label>
          <label
            className="inline-block mb-2 text-gray-500"
            style={{ float: "right" }}
            onClick={() => props.setModal(false)}
          >
            ❌
          </label>
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col w-full h-32 border-4 border-blue-200 border-dashed hover:bg-gray-100 hover:border-gray-300">
              <div className="flex flex-col items-center justify-center pt-7">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-8 h-8 text-gray-400 group-hover:text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                <p className="pt-1 text-sm tracking-wider text-gray-400 group-hover:text-gray-600">
                  Attach a file
                </p>
              </div>
              <input
                type="file"
                className="opacity-0"
                ref={fileInputRef}
                onChange={() => {}}
              />
              <input type="file" className="opacity-0" />
            </label>
          </div>
        </div>
        <div className="flex justify-center p-2">
          <button
            className="w-full px-4 py-2 text-white bg-blue-500 rounded shadow-xl"
            onClick={() => updatePP()}
          >
            Upload
          </button>
        </div>
      </div>
    </div>
  );
}

export default PPModal;
