import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";
import html2canvas from 'html2canvas-pro';
import { saveAs } from "file-saver";
import { Camera } from "lucide-react";
import { IconButton } from "@mui/material";
import rankColors from "../rankColors";
import UserData from "../types";
import platformImages from "../platformImages";


const UserModal: React.FC<{ user: UserData; onClose: () => void }> = ({ user, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close modal when clicking outside the modal content
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);


  const downloadImage = async (e: any) => {
    e.preventDefault();

    try {
      if (modalRef.current) {
        // Capture the 
        modalRef.current.style.maxHeight = "none";
        modalRef.current.style.overflow = "visible";
        const canvas = await html2canvas(modalRef.current, {
          useCORS: true,
          backgroundColor: "#020817",
        });
        // Save the image
        canvas.toBlob((blob) => {
          if (blob) {
            saveAs(blob, `UserProfile.png`);
          }
        });
        modalRef.current.style.maxHeight = "90vh";
        modalRef.current.style.overflow = "auto";
      }
    } catch (err) {
      console.error("Error downloading image:", err);
    }
  };


  return (
    <div className="fixed inset-0 backdrop-blur-xs backdrop-brightness-50 flex items-center justify-center z-50 p-4">
      {/* Modal Content Wrapper */}
      <div
        ref={modalRef}
        className="bg-gray-800 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-indigo-400">{user.name}</h2>
          <div className="flex items-center gap-4">
            {/* Download Button */}
            {/* <button
              onClick={downloadImage}
              className="bg-indigo-500 hover:cursor-pointer hover:bg-indigo-600 text-white px-4 py-2 rounded-lg transition-colors"
            > */}
            <IconButton
              onClick={downloadImage}
              className="!text-indigo-500 hover:!bg-indigo-900/30 !rounded-lg !p-2 !transition-all"
              title="Download Card"
            >
              <Camera className="text-2xl" />
            </IconButton>
            {/* Close Button */}
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-200 hover:cursor-pointer transition-colors text-2xl"
            >
              ✕
            </button>
          </div>
        </div>

        {/* User Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="space-y-2">
            <p className="text-gray-300">
              <span className="font-semibold text-indigo-300">Roll No:</span> {user.roll}
            </p>
            <p className="text-gray-300">
              <span className="font-semibold text-indigo-300">Section:</span> {user.section}
            </p>
            <p className="text-gray-300">
              <span className="font-semibold text-indigo-300">Branch:</span> {user.branch}
            </p>
            <p className="text-gray-300">
              <span className="font-semibold text-indigo-300">Passing Year:</span> {user.passingYear}
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-gray-300">
              <span className="font-semibold text-indigo-300">Email:</span> {user.gmail}
            </p>
            <p className="text-gray-300">
              <span className="font-semibold text-indigo-300">Phone:</span> {user.phone}
            </p>
          </div>
        </div>

        {/* Platform Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* LeetCode Stats */}
          <div className="bg-gray-700 p-4 rounded-lg">
            <Link target="_blank" to={"https://leetcode.com/u/" + user.lcUsername}>
              <img src={platformImages["LeetCode"]} alt="LeetCode" />
              <h3 className="text-lg font-semibold text-indigo-300 mb-3">LeetCode Stats</h3>
              {user.lcTotal === -1 ?
                <h1 className="text-red-500 text-2xl">Wrong Username OOPs!</h1>
                :
                <div className="space-y-1">
                  <p className="text-green-400">Easy: {user.lcEasy}</p>
                  <p className="text-yellow-400">Medium: {user.lcMedium}</p>
                  <p className="text-red-400">Hard: {user.lcHard}</p>
                  <p className="text-gray-100 font-semibold">Total: {user.lcTotal}</p>
                </div>
              }
            </Link>
          </div>

          {/* Codeforces Stats */}
          <div className="bg-gray-700 p-4 rounded-lg">
            <Link target="_blank" to={"https://codeforces.com/profile/" + user.cfUsername}>
              <img src={platformImages["Codeforces"]} alt="Codeforces" />
              <h3 className="text-lg font-semibold text-indigo-300 mb-3">Codeforces Stats</h3>
              {user.cfTotal === -1 ?
                <h1 className="text-red-500 text-2xl">Wrong Username OOPs!</h1>
                :
                <div className="space-y-1">
                  <p className={rankColors[user.cfRank.toLowerCase()]}>Rank: {user.cfRank}</p>
                  <p className="text-gray-100">Rating: {user.cfRating}</p>
                  <p className="text-gray-100">Total Solved: {user.cfTotal}</p>
                </div>
              }
            </Link>
          </div>

          {/* CodeChef Stats */}
          <div className="bg-gray-700 p-4 rounded-lg">
            <Link target="_blank" to={"https://codechef.com/users/" + user.ccUsername}>
              <img width="100" height="100" src={platformImages["CodeChef"]} alt="CodeChef" />
              <h3 className="text-lg font-semibold text-indigo-300 mb-3">CodeChef Stats</h3>
              {user.ccTotal === -1 ?
                <h1 className="text-red-500 text-2xl">Wrong Username OOPs!</h1>
                :
                <div className="space-y-1">
                  <p style={{ color: rankColors[user.ccRank.toLowerCase()] }}>Rank: {user.ccRank}</p>                <p className="text-gray-100">Rating: {user.ccRating}</p>
                  <p className="text-gray-100">Total Solved: {user.ccTotal}</p>
                </div>
              }
            </Link>
          </div>

          {/* GFG Stats */}
          <div className="bg-gray-700 p-4 rounded-lg">
            <Link target="_blank" to={"https://www.geeksforgeeks.org/user/" + user.ggUsername}>
              <img className="w-10 h-10" src={platformImages["GFG"]} alt="GFG" />
              <h3 className="text-lg font-semibold text-indigo-300 mb-3">GfG Stats</h3>
              {user.ggTotal === -1 ?
                <h1 className="text-red-500 text-2xl">Wrong Username OOPs!</h1>
                :
                <p className="text-gray-100 text-xl font-semibold">Total Solved: {user.ggTotal}</p>
              }
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserModal;








