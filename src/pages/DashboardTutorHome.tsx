function DashboardTutorHome() {
    return (
        <div className="p-4">
            <div className="grid grid-cols-2 gap-x-20">
                <div>
                    <h2 className="text-2xl font-bold mb-4">Stats</h2>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <div className="p-4 bg-green-100 rounded-xl">
                                <div className="font-bold text-xl text-gray-800 leading-none">Good day, Nicholas</div>
                            </div>
                        </div>
                        <div className="p-4 bg-yellow-100 rounded-xl text-gray-800">
                            <div className="font-bold text-2xl leading-none">20</div>
                            <div className="mt-2">Lessons Finished</div>
                        </div>
                        <div className="p-4 bg-yellow-100 rounded-xl text-gray-800">
                            <div className="font-bold text-2xl leading-none">4.6</div>
                            <div className="mt-2">Average Rating</div>
                        </div>
                        <div className="col-span-2">
                            <div className="p-4 bg-purple-100 rounded-xl text-gray-800">
                                <div className="font-bold text-xl leading-none">Your Total Earnings</div>
                                <div className="mt-2">Rp. 12,325,000</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <h2 className="text-2xl font-bold mb-4">Your Recent Messages</h2>

                    <div className="space-y-4">
                        <div className="p-4 bg-white border rounded-xl text-gray-800 space-y-2">
                            <a href="javascript:void(0)" className="font-bold hover:text-yellow-800 hover:underline">
                                Kevin
                            </a>
                            <div className="flex justify-between">
                                <div className="text-gray-400 text-xs">Ko ini gimana kalo misal pake div?</div>
                                <div className="text-gray-400 text-xs">1h</div>
                            </div>
                        </div>
                        <div className="p-4 bg-white border rounded-xl text-gray-800 space-y-2">
                            <a href="javascript:void(0)" className="font-bold hover:text-yellow-800 hover:underline">
                                Alex
                            </a>
                            <div className="flex justify-between">
                                <div className="text-gray-400 text-xs">Ko kenapa kok ini gabisa ya?</div>
                                <div className="text-gray-400 text-xs">2h</div>
                            </div>
                        </div>
                        <div className="p-4 bg-white border rounded-xl text-gray-800 space-y-2">
                            <a href="javascript:void(0)" className="font-bold hover:text-yellow-800 hover:underline">
                                Kenneth
                            </a>
                            <div className="flex justify-between">
                                <div className="text-gray-400 text-xs">sori ko aku gabisa dateng aku ketumpuk praktikum</div>
                                <div className="text-gray-400 text-xs">4h</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DashboardTutorHome;
