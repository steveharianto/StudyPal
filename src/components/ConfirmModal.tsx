import React, { useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectCheckout, setCheckout } from "../redux/checkoutSlice.js";

function ConfirmModal(props) {
  const dispatch = useDispatch();
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute w-full h-full bg-black opacity-50"></div>

      {/* Modal */}
      <div className="absolute w-1/3 max-w-2xl rounded-lg p-10 pb-3 shadow-xl bg-gray-50 text-center">
        <label className="text-center text-gray-800">
          Apakah anda yakin untuk melakukan booking pada tutor dan jam ini?
        </label>
        <div className="flex justify-center p-2 mt-2">
          <button
            className="w-1/3 px-4 py-2 me-5 text-white bg-blue-500 rounded shadow-xl"
            onClick={() => dispatch(setCheckout(true))}
          >
            Ya
          </button>
          <button
            className="w-1/3 px-4 py-2 text-white bg-red-500 rounded shadow-xl"
            onClick={() => props.setConfirm(false)}
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
