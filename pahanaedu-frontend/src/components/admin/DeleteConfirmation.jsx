import React from 'react';

const DeleteConfirmation = ({ onCancel, onConfirm }) => {
    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Deletion</h3>
                <p>Are you sure you want to delete this book?</p>
                <div className="flex justify-end mt-4">
                    <button onClick={onCancel} className="bg-gray-300 text-black px-4 py-2 rounded-md mr-2">Cancel</button>
                    <button onClick={onConfirm} className="bg-red-500 text-white px-4 py-2 rounded-md">Delete</button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmation;