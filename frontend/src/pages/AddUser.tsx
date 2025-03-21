import { useState } from "react";

const AddUser = () => {
  const [name, setName] = useState("");
  const [roll, setRoll] = useState("");
  const [section, setSection] = useState("");
  const [lcUsername, setLcUsername] = useState("");
  const [cfUsername, setCfUsername] = useState("");
  const [ccUsername, setCcUsername] = useState("");
  const [ggUsername, setGgUsername] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ name, roll, lcUsername, cfUsername, ccUsername, ggUsername, section });
  };

  return (
    
    <div className="p-6 m-2 border rounded-2xl max-w-6xl mx-auto bg-gray-900 min-h-screen text-gray-100 border border-gray-700">

        <div className="pb-8 border-b border-gray-700">
          <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
            Add New User
          </h1>
        </div>
        
        <div className="p-8 space-y-8">
          <form className="space-y-8" onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Personal Info Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-gray-300 font-medium block">
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="Rajat Gupta"
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white placeholder-gray-400"
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-gray-300 font-medium block">
                    Roll No.
                  </label>
                  <input
                    type="text"
                    placeholder="2200330100172"
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white placeholder-gray-400"
                    onChange={(e) => setRoll(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-gray-300 font-medium block">
                    Section
                  </label>
                  <input
                    type="text"
                    placeholder="A"
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white placeholder-gray-400"
                    onChange={(e) => setSection(e.target.value)}
                  />
                </div>
              </div>

              {/* Platform Usernames */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-gray-300 font-medium block">
                    <span className="flex items-center gap-2">
                      <img 
                        src="https://img.icons8.com/external-tal-revivo-color-tal-revivo/24/external-level-up-your-coding-skills-and-quickly-land-a-job-logo-color-tal-revivo.png" 
                        className="w-5 h-5"
                        alt="LeetCode"
                      />
                      LeetCode Username
                    </span>
                  </label>
                  <input
                    type="text"
                    placeholder="rajatgupta05"
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white placeholder-gray-400"
                    onChange={(e) => setLcUsername(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-gray-300 font-medium block">
                    <span className="flex items-center gap-2">
                      <img 
                        src="https://img.icons8.com/external-tal-revivo-shadow-tal-revivo/24/external-codeforces-programming-competitions-and-contests-programming-community-logo-shadow-tal-revivo.png" 
                        className="w-5 h-5"
                        alt="Codeforces"
                      />
                      Codeforces Username
                    </span>
                  </label>
                  <input
                    type="text"
                    placeholder="rajatgupta05"
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white placeholder-gray-400"
                    onChange={(e) => setCfUsername(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-gray-300 font-medium block">
                    <span className="flex items-center gap-2">
                      <img 
                        src="https://cdn.codechef.com/images/cc-logo.svg" 
                        className="w-5 h-5"
                        alt="CodeChef"
                      />
                      CodeChef Username
                    </span>
                  </label>
                  <input
                    type="text"
                    placeholder="rajatgupta05"
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white placeholder-gray-400"
                    onChange={(e) => setCcUsername(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-gray-300 font-medium block">
                    <span className="flex items-center gap-2">
                      <img 
                        src="https://img.icons8.com/?size=100&id=AbQBhN9v62Ob&format=png&color=000000" 
                        className="w-5 h-5 filter invert"
                        alt="GFG"
                      />
                      GFG Username
                    </span>
                  </label>
                  <input
                    type="text"
                    placeholder="rajatgupta05"
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white placeholder-gray-400"
                    onChange={(e) => setGgUsername(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-4 px-6 rounded-lg transition-all duration-200 hover:scale-[1.02]"
              >
                Add User
              </button>
            </div>
          </form>
        </div>
    </div>
  );
};

export default AddUser;