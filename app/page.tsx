import { SportCard } from "@/components/sport-card"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-12 text-center">Our Programs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 auto-rows-auto">
          <div className="h-fit">
            <SportCard
              sport="Swimming"
              image="https://images.unsplash.com/photo-1519315901367-f34ff9154487?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80"
              morningTimings={[
                { time: "6:00 AM to 7:00 AM", type: "Adults / Advanced" },
                { time: "7:00 AM to 8:00 AM", type: "Adults / Advanced" },
                { time: "8:30 AM to 9:30 AM", type: "Beginner / Intermediate" },
                { time: "9:30 AM to 10:30 AM", type: "Beginner / Intermediate" },
                { time: "10:30 AM to 11:30 AM", type: "Beginner / Intermediate" },
              ]}
              eveningTimings={[
                { time: "4:00 PM to 5:00 PM", type: "Beginner / Intermediate" },
                { time: "5:00 PM to 6:00 PM", type: "Beginner / Intermediate" },
                { time: "6:00 PM to 7:00 PM", type: "Beginner / Intermediate" },
                { time: "7:00 PM to 8:00 PM", type: "Adults / Advanced" },
              ]}
              batches={[
                { name: "1st Batch", dates: "March 31st to 18th April" },
                { name: "2nd Batch", dates: "April 21st to 9th May" },
                { name: "3rd Batch", dates: "May 12th to 30th May" },
              ]}
              feeStructure={{
                weekday: "1",
                weekend: {
                  oneMonth: "2500",
                  twoMonths: "4000",
                },
              }}
              equipment={["Swimsuit", "Goggles", "Swim cap", "Towel"]}
              additionalInfo="All Adult and kids classes are 1 hour duration - 5 mins warm up and 55 mins class. BGS Students fee: 3,500."
            />
          </div>
          <div className="h-fit">
            <SportCard
              sport="Badminton"
              image="https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
              morningTimings={[
                { time: "7:00 AM to 8:00 AM", type: "Beginner / Intermediate" },
                { time: "8:00 AM to 9:00 AM", type: "Beginner / Intermediate" },
              ]}
              eveningTimings={[
                { time: "3:00 PM to 4:00 PM", type: "Beginner / Intermediate" },
                { time: "4:00 PM to 5:00 PM", type: "Beginner / Intermediate" },
                { time: "5:00 PM to 6:00 PM", type: "Beginner / Intermediate" },
              ]}
              batches={[
                { name: "Batch 1 (Weekdays)", dates: "March 31st to April 25th" },
                { name: "Batch 2 (Weekends)", dates: "April 28th to May 24th" },
              ]}
              feeStructure={{
                weekday: "3500",
                weekend: {
                  regular: "3000",
                },
              }}
              equipment={["Rackets", "Shoes"]}
              additionalInfo="10 slots available for beginners and 10 for intermediate in each batch. Advanced slots are not available."
            />
          </div>
        </div>
      </main>
    </div>
  )
}

