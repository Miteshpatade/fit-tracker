"use client";
import { usePathname } from 'next/navigation';

import React from "react";
import "./workoutPage.css";

const Page = () => {
  const [workouts, setWorkouts] = React.useState<any[]>([]);
  const pathname = usePathname();
  console.log(pathname, "mitesh")
  const lastSegment = pathname.split('/').filter(Boolean).pop();

console.log(lastSegment);
  const getWorkouts = async () => {
    let data = [
      {
        type: "Chest",
        imageUrl:
          "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
        durationInMin: 30,
        exercises: [
          {
            exercise: "Flat Bench Press",
            videoUrl: "https://gymvisual.com/img/p/1/7/5/5/2/17552.gif",
            sets: 3,
            reps: 10,
            rest: 60,
            description: "Targets chest muscles for strength and size.",
          },
          {
            exercise: "Incline Bench Press",
            videoUrl: "https://gymvisual.com/img/p/1/0/3/9/8/10398.gif",
            sets: 3,
            reps: 10,
            rest: 60,
            description: "Works upper chest for better definition.",
          },
        ],
      },
      {
        type: "Abs",
        imageUrl: "https://images.unsplash.com/photo-1517963879433-6ad6ec5f76fd",
        durationInMin: 20,
        exercises: [
          {
            exercise: "Plank",
            videoUrl: "https://gymvisual.com/img/p/5/2/1/6/5216.gif",
            sets: 3,
            reps: "Hold 30 sec",
            rest: 30,
            description: "Core strength and endurance.",
          },
          {
            exercise: "Leg Raises",
            videoUrl: "https://gymvisual.com/img/p/4/8/7/3/4873.gif",
            sets: 3,
            reps: 12,
            rest: 30,
            description: "Targets lower abs and hip flexors.",
          },
        ],
      },
      {
        type: "Shoulder",
        imageUrl: "https://images.unsplash.com/photo-1521804906057-8f2388e0a38e",
        durationInMin: 25,
        exercises: [
          {
            exercise: "Overhead Press",
            videoUrl: "https://gymvisual.com/img/p/6/3/2/2/6322.gif",
            sets: 3,
            reps: 10,
            rest: 60,
            description: "Builds shoulder strength and stability.",
          },
        ],
      },
      {
        type: "Back",
        imageUrl: "https://images.unsplash.com/photo-1586339949916-3e9457bef6d3",
        durationInMin: 30,
        exercises: [
          {
            exercise: "Pull-ups",
            videoUrl: "https://gymvisual.com/img/p/2/6/4/8/2648.gif",
            sets: 3,
            reps: 8,
            rest: 60,
            description: "Improves upper body and grip strength.",
          },
        ],
      },
      {
        type: "Biceps",
        imageUrl: "https://images.unsplash.com/photo-1534368970876-6c9f0d427a63",
        durationInMin: 20,
        exercises: [
          {
            exercise: "Barbell Curls",
            videoUrl: "https://gymvisual.com/img/p/3/8/5/2/3852.gif",
            sets: 3,
            reps: 12,
            rest: 45,
            description: "Strengthens biceps and forearms.",
          },
        ],
      },
      {
        type: "Triceps",
        imageUrl: "https://images.unsplash.com/photo-1590595957852-df0d845a0c6c",
        durationInMin: 20,
        exercises: [
          {
            exercise: "Dips",
            videoUrl: "https://gymvisual.com/img/p/5/9/3/7/5937.gif",
            sets: 3,
            reps: 10,
            rest: 60,
            description: "Targets triceps and chest.",
          },
        ],
      },
      {
        type: "Legs",
        imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1b",
        durationInMin: 40,
        exercises: [
          {
            exercise: "Squats",
            videoUrl: "https://gymvisual.com/img/p/1/5/8/9/8/15898.gif",
            sets: 4,
            reps: 10,
            rest: 60,
            description: "Builds leg muscles and core strength.",
          },
        ],
      },
      {
        type: "Cardio",
        imageUrl: "https://images.unsplash.com/photo-1584467928999-00a0944f48b0",
        durationInMin: 30,
        exercises: [
          {
            exercise: "Jump Rope",
            videoUrl: "https://gymvisual.com/img/p/3/1/8/8/3188.gif",
            sets: 3,
            reps: "1 min",
            rest: 30,
            description: "Boosts endurance and burns calories.",
          },
        ],
      },
      {
        type: "Forearms",
        imageUrl: "https://images.unsplash.com/photo-1611929280096-9de85657d91b",
        durationInMin: 10,
        exercises: [
          {
            exercise: "Wrist Curls",
            videoUrl: "https://gymvisual.com/img/p/1/5/6/8/1568.gif",
            sets: 3,
            reps: 15,
            rest: 45,
            description: "Strengthens wrist flexors for grip and endurance.",
          },
          {
            exercise: "Reverse Wrist Curls",
            videoUrl: "https://gymvisual.com/img/p/2/6/7/2/2672.gif",
            sets: 3,
            reps: 12,
            rest: 45,
            description: "Targets wrist extensors to build forearm definition.",
          }
        ],
      }
      
    ];

    setWorkouts(data);
  };
  const filteredWorkouts = workouts.filter(workout => 
    workout.type.toLowerCase() === lastSegment?.toLowerCase()
  );
  React.useEffect(() => {
    getWorkouts();
  }, []);

  return (
    <div className="workout">
      <h1 className="mainhead1">Workout Plans</h1>

      {filteredWorkouts.map((workout, workoutIndex) => (
        <div key={workoutIndex} className="workout__section">
          <h2>{workout.type} Day</h2>
          <div className="workout__exercises">
            {workout.exercises.map((item: any, index: number) => (
              <div
                key={index}
                className={
                  index % 2 === 0
                    ? "workout__exercise"
                    : "workout__exercise workout__exercise--reverse"
                }
              >
                <h3>{index + 1}</h3>
                <div className="workout__exercise__image">
                  <img src={item.videoUrl} alt={item.exercise} />
                </div>
                <div className="workout__exercise__content">
                  <h2>{item.exercise}</h2>
                  <span>
                    {item.sets} sets X {item.reps} reps
                  </span>
                  <p>{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Page;