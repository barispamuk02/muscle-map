
const recoveryTranslations = {
  en: {
    back: {
      name: "Back and Lower Back",
      subtitle: "Therapeutic exercises for lower back pain",
      warning: "⚠️ If you have acute pain, a herniated disc, or a disc protrusion, you MUST consult a neurologist. These exercises are intended only for chronic conditions and prevention.",
      phases: [
        {
          name: "Phase 1 — Acute (1-2 weeks)",
          description: "Rest and minimal activity. The goal is to relieve pain without making the condition worse.",
          exercises: [
            {
              name: "Child's Pose",
              duration: "30-60 sec × 3",
              description: "Kneel on the floor, sit back on your heels, and extend your arms forward. Relax your lower back."
            },
            {
              name: "Knees to Chest",
              duration: "30 sec × 3",
              description: "Lie on your back, bring both knees toward your chest, and hug them with your arms."
            },
            {
              name: "Diaphragmatic Breathing",
              duration: "5 min",
              description: "Lie on your back with one hand on your abdomen. Inhale slowly, allowing your belly to rise. Exhale slowly as it falls."
            },
            {
              name: "Marching in Place",
              duration: "5-10 min",
              description: "Walk slowly at a comfortable pace while keeping your back straight."
            }
          ]
        },
        {
          name: "Phase 2 — Recovery (2-6 weeks)",
          description: "Gentle core strengthening and stretching.",
          exercises: [
            {
              name: "Cat-Cow",
              duration: "10 reps",
              description: "Start on all fours. Inhale as you arch your back downward, then exhale as you round your spine."
            },
            {
              name: "Glute Bridge",
              duration: "10-15 reps × 3",
              description: "Lie on your back with your knees bent. Lift your hips, hold for 2 sec, then lower slowly."
            },
            {
              name: "Knee Plank",
              duration: "20-30 sec × 3",
              description: "Support yourself on your forearms and knees. Keep your back straight and your core engaged."
            },
            {
              name: "Hip Flexor Stretch",
              duration: "30 sec × 2 per side",
              description: "Kneel on one knee with the other foot in front. Gently push your hips forward until you feel a stretch."
            },
            {
              name: "Bird-Dog",
              duration: "10 reps per side",
              description: "Start on all fours. Extend your opposite arm and leg, and hold for 3 sec."
            }
          ]
        },
        {
          name: "Phase 3 — Strengthening (6+ weeks)",
          description: "Full strengthening exercises to help prevent future problems.",
          exercises: [
            {
              name: "Plank",
              duration: "30-60 sec × 3",
              description: "Hold a standard forearm plank, supporting your body on your elbows and toes."
            },
            {
              name: "Side Plank",
              duration: "20-30 sec × 2 per side",
              description: "Lie on your side and support your body on one elbow and the side of your foot."
            },
            {
              name: "Dead Bug",
              duration: "10 reps × 3",
              description: "Lie on your back with your arms raised and knees bent. Slowly lower your opposite arm and leg."
            },
            {
              name: "Light Romanian Deadlift",
              duration: "10 reps × 3",
              description: "Hinge forward at the hips while keeping your back straight. Hold light dumbbells or a barbell."
            },
            {
              name: "Hyperextension",
              duration: "12 reps × 3",
              description: "Perform controlled back extensions using a back extension machine or bench."
            }
          ]
        }
      ]
    },

    knee: {
      name: "Knee",
      subtitle: "Recovery after meniscus or ligament injuries",
      warning: "⚠️ If you have a torn ligament, a meniscus tear, or have undergone surgery, exercise only under the supervision of a rehabilitation specialist. Do not start on your own!",
      phases: [
        {
          name: "Phase 1 — Acute (1-3 weeks)",
          description: "Reduce swelling and restore mobility.",
          exercises: [
            {
              name: "Quadriceps Isometric Contractions",
              duration: "10 sec × 10",
              description: "Sit with your leg straight. Tighten your thigh muscles, hold for 10 sec, then relax."
            },
            {
              name: "Straight Leg Raise",
              duration: "10 reps × 3",
              description: "Lie on your back with one knee bent. Raise your straight leg about 30 cm off the floor and hold for 3 sec."
            },
            {
              name: "Ankle Pumps",
              duration: "20 reps × 3",
              description: "While seated, point your toes toward and away from your body. This helps promote venous blood flow."
            },
            {
              name: "Ice Pack",
              duration: "15-20 min × 3 per day",
              description: "Apply ice wrapped in a towel to help reduce swelling."
            }
          ]
        },
        {
          name: "Phase 2 — Recovery (3-8 weeks)",
          description: "Strengthen the muscles surrounding the knee.",
          exercises: [
            {
              name: "Wall Mini Squats",
              duration: "20-30 sec × 3",
              description: "Stand with your back against a wall and feet shoulder-width apart. Bend your knees to about 30° and hold."
            },
            {
              name: "Light Leg Extension",
              duration: "12 reps × 3",
              description: "Perform leg extensions on a machine using light resistance. Move slowly and without pain."
            },
            {
              name: "Prone Leg Curl",
              duration: "12 reps × 3",
              description: "Lie on your stomach and bend your leg at the knee."
            },
            {
              name: "Single-Leg Balance",
              duration: "30 sec × 3",
              description: "Stand on one leg, using support if necessary."
            },
            {
              name: "Single-Leg Glute Bridge",
              duration: "10 reps × 3",
              description: "Lie on your back with one leg raised off the floor. Lift your hips."
            }
          ]
        },
        {
          name: "Phase 3 — Strengthening (8+ weeks)",
          description: "Gradually return to full physical activity.",
          exercises: [
            {
              name: "Weighted Squats",
              duration: "10 reps × 3",
              description: "Perform full-range squats using a barbell or dumbbells."
            },
            {
              name: "Lunges",
              duration: "10 reps × 3",
              description: "Perform stationary forward lunges."
            },
            {
              name: "Leg Press",
              duration: "12 reps × 3",
              description: "Use a leg press machine with moderate resistance."
            },
            {
              name: "Jump Rope",
              duration: "1-2 min",
              description: "Land softly with your knees slightly bent."
            },
            {
              name: "Bulgarian Split Squat",
              duration: "10 reps × 3",
              description: "Perform split squats with your rear foot elevated."
            }
          ]
        }
      ]
    },

    shoulder: {
      name: "Shoulder",
      subtitle: "Recovery after a strain or shoulder impingement",
      warning: "⚠️ If you have a rotator cuff tear or shoulder dislocation, exercise only under medical supervision. Do not push too hard!",
      phases: [
        {
          name: "Phase 1 — Acute (1-2 weeks)",
          description: "Rest and pain relief.",
          exercises: [
            {
              name: "Pendulum Exercises",
              duration: "30 sec × 3",
              description: "Lean forward and let your arm hang freely. Make gentle circular movements."
            },
            {
              name: "Shoulder Isometric Exercises",
              duration: "10 sec × 10",
              description: "Hold your arm out to the side and press against a wall in four different directions."
            },
            {
              name: "Wrist Flexion and Extension",
              duration: "20 reps × 3",
              description: "Gently flex and extend your wrist to promote circulation."
            }
          ]
        },
        {
          name: "Phase 2 — Recovery (2-8 weeks)",
          description: "Strengthen the rotator cuff muscles.",
          exercises: [
            {
              name: "Resistance Band External Rotation",
              duration: "12 reps × 3",
              description: "Bend your elbow to 90°, hold a resistance band, and rotate your forearm outward."
            },
            {
              name: "Resistance Band Internal Rotation",
              duration: "12 reps × 3",
              description: "Use the same position, but rotate your forearm inward against the resistance band."
            },
            {
              name: "Front Arm Raise",
              duration: "12 reps × 3",
              description: "Raise your arm forward using a light dumbbell, either lying down or standing."
            },
            {
              name: "Scapular Push-Ups",
              duration: "10 reps × 3",
              description: "Start in a push-up position. Bring your shoulder blades together while keeping your torso stable."
            },
            {
              name: "Cross-Body Shoulder Stretch",
              duration: "30 sec × 2",
              description: "Bring one arm across your chest and gently pull it closer with your other hand."
            }
          ]
        },
        {
          name: "Phase 3 — Strengthening (8+ weeks)",
          description: "Return to pressing and pulling exercises.",
          exercises: [
            {
              name: "Dumbbell Shoulder Press",
              duration: "10 reps × 3",
              description: "Perform seated or standing dumbbell presses using moderate weight."
            },
            {
              name: "Dumbbell Lateral Raises",
              duration: "12 reps × 3",
              description: "Raise dumbbells out to the sides until your arms reach shoulder height."
            },
            {
              name: "Upright Row",
              duration: "12 reps × 3",
              description: "Perform upright rows using a barbell or dumbbells."
            },
            {
              name: "Pull-Ups",
              duration: "max × 3",
              description: "Perform pull-ups if you can do them without pain."
            },
            {
              name: "Standing Barbell Overhead Press",
              duration: "10 reps × 3",
              description: "Start with light weight and gradually increase the load."
            }
          ]
        }
      ]
    },

    ankle: {
      name: "Ankle",
      subtitle: "Recovery after an ankle sprain",
      warning: "⚠️ If you have a complete ligament tear, seek medical supervision. Do not put weight on the injured ankle too soon!",
      phases: [
        {
          name: "Phase 1 — Acute (3-7 days)",
          description: "Rest, ice, and compression.",
          exercises: [
            {
              name: "Ankle Alphabet",
              duration: "Once per day",
              description: "Use your foot to trace letters of the alphabet in the air."
            },
            {
              name: "Ice Application",
              duration: "15 min × 3 per day",
              description: "Apply ice wrapped in a towel."
            },
            {
              name: "Leg Elevation",
              duration: "20 min × 3",
              description: "Elevate your leg above heart level to help reduce swelling."
            }
          ]
        },
        {
          name: "Phase 2 — Recovery (1-4 weeks)",
          description: "Restore ankle mobility and strength.",
          exercises: [
            {
              name: "Ankle Pumps",
              duration: "20 reps × 3",
              description: "Point your toes toward and away from your body."
            },
            {
              name: "Ankle Circles",
              duration: "10 reps × 2 each direction",
              description: "Slowly rotate your ankle in both directions without pain."
            },
            {
              name: "Double-Leg Calf Raises",
              duration: "15 reps × 3",
              description: "Raise your heels while using a wall for support."
            },
            {
              name: "Single-Leg Balance",
              duration: "30 sec × 3",
              description: "Start with support, then progress to balancing without assistance."
            },
            {
              name: "Heel and Toe Walking",
              duration: "20 steps",
              description: "Alternate between walking on your heels and your toes."
            }
          ]
        },
        {
          name: "Phase 3 — Strengthening (4+ weeks)",
          description: "Return to running and jumping activities.",
          exercises: [
            {
              name: "Single-Leg Calf Raise",
              duration: "15 reps × 3",
              description: "Raise your heel while standing on one leg without support."
            },
            {
              name: "Single-Leg Hops",
              duration: "10 reps × 2",
              description: "Hop gently on one leg with soft, controlled landings."
            },
            {
              name: "Running",
              duration: "10-20 min",
              description: "Start at an easy, comfortable pace."
            },
            {
              name: "Jump Rope",
              duration: "2-3 min",
              description: "Focus on soft, controlled landings."
            },
            {
              name: "Single-Leg Squat",
              duration: "8 reps × 3",
              description: "Perform pistol squats or assisted single-leg squats."
            }
          ]
        }
      ]
    },

    elbow: {
      name: "Elbow",
      subtitle: "Tennis elbow / Golfer's elbow",
      warning: "⚠️ Consult a doctor if you experience severe pain. Do not push through pain during exercise!",
      phases: [
        {
          name: "Phase 1 — Acute (1-2 weeks)",
          description: "Reduce inflammation.",
          exercises: [
            {
              name: "Wrist Isometric Exercises",
              duration: "10 sec × 10",
              description: "Press your fist against a table in different directions without moving your wrist."
            },
            {
              name: "Ice Application",
              duration: "15 min × 2-3 per day",
              description: "Apply ice to the painful area."
            },
            {
              name: "Forearm Stretch",
              duration: "20 sec × 3",
              description: "Use your opposite hand to gently bend your wrist downward."
            }
          ]
        },
        {
          name: "Phase 2 — Recovery (2-6 weeks)",
          description: "Strengthen the forearm muscles.",
          exercises: [
            {
              name: "Dumbbell Wrist Curl",
              duration: "12 reps × 3",
              description: "Hold a dumbbell with your palm facing up. Slowly curl your wrist."
            },
            {
              name: "Dumbbell Wrist Extension",
              duration: "12 reps × 3",
              description: "Hold a dumbbell with your palm facing down. Slowly extend your wrist."
            },
            {
              name: "Towel Wringing",
              duration: "10 reps × 3",
              description: "Twist a wet towel tightly using your hands."
            },
            {
              name: "Hand Grip Strengthener",
              duration: "15 reps × 3",
              description: "Use light resistance and exercise regularly."
            }
          ]
        },
        {
          name: "Phase 3 — Strengthening (6+ weeks)",
          description: "Return to strength training.",
          exercises: [
            {
              name: "Barbell Biceps Curl",
              duration: "10 reps × 3",
              description: "Start with light weight."
            },
            {
              name: "Reverse Barbell Curl",
              duration: "10 reps × 3",
              description: "Perform curls with your palms facing down."
            },
            {
              name: "Hammer Curls",
              duration: "12 reps × 3",
              description: "Keep your palms facing each other using a neutral grip."
            },
            {
              name: "Push-Ups",
              duration: "10-15 reps × 3",
              description: "Perform push-ups with your hands about shoulder-width apart."
            }
          ]
        }
      ]
    },

    general: {
      name: "General Recovery",
      subtitle: "Full-body stretching and cool-down",
      warning: "💡 These preventive exercises are suitable for everyone. Perform them after your workout to support recovery.",
      phases: [
        {
          name: "Post-Workout Cool-Down",
          description: "5-10 minutes to gradually lower your heart rate.",
          exercises: [
            {
              name: "Marching in Place",
              duration: "2-3 min",
              description: "March slowly in place while allowing your breathing to return to normal."
            },
            {
              name: "Full-Body Stretching",
              duration: "5 min",
              description: "Stretch from head to toe, holding each muscle group for 20-30 sec."
            },
            {
              name: "4-7-8 Breathing",
              duration: "5 min",
              description: "Inhale for 4 sec, hold your breath for 7 sec, then exhale for 8 sec. Helps calm the nervous system."
            }
          ]
        },
        {
          name: "Morning Mobility",
          description: "5-10 minutes to wake up your body.",
          exercises: [
            {
              name: "Full-Body Stretch in Bed",
              duration: "1 min",
              description: "Extend your arms overhead and stretch your legs downward to lengthen your entire body."
            },
            {
              name: "Cat-Cow",
              duration: "10 reps",
              description: "Gently alternate between arching and rounding your back."
            },
            {
              name: "Shoulder Rolls",
              duration: "10 reps each direction",
              description: "Roll your shoulders forward and backward."
            },
            {
              name: "Hip Circles",
              duration: "10 reps",
              description: "Rotate your hips in circular movements in both directions."
            }
          ]
        },
        {
          name: "Evening Relaxation",
          description: "10 minutes before bedtime.",
          exercises: [
            {
              name: "Child's Pose",
              duration: "2 min",
              description: "Relax your lower back in Child's Pose."
            },
            {
              name: "Legs Up the Wall",
              duration: "5 min",
              description: "Lie on your back with your legs elevated against a wall to support venous circulation."
            },
            {
              name: "Body Scan Meditation",
              duration: "5 min",
              description: "Mentally scan your body from your feet to the top of your head, relaxing each area."
            }
          ]
        }
      ]
    }
  }
};
// ============================================================
// RECOVERY TRANSLATIONS — HELPERS
// ============================================================

function getRecoveryTranslation(categoryId) {
    if (currentLang === 'ru') return null; // RU — берём из recoveryDatabase
    return recoveryTranslations.en[categoryId] || null;
}

function getRecoveryName(category) {
    const tr = getRecoveryTranslation(category.id);
    return tr ? tr.name : category.name;
}

function getRecoverySubtitle(category) {
    const tr = getRecoveryTranslation(category.id);
    return tr ? tr.subtitle : category.subtitle;
}

function getRecoveryWarning(category) {
    const tr = getRecoveryTranslation(category.id);
    return tr ? tr.warning : category.warning;
}

function getRecoveryPhaseName(category, phaseIndex) {
    const tr = getRecoveryTranslation(category.id);
    return tr ? tr.phases[phaseIndex].name : category.phases[phaseIndex].name;
}

function getRecoveryPhaseDescription(category, phaseIndex) {
    const tr = getRecoveryTranslation(category.id);
    return tr ? tr.phases[phaseIndex].description : category.phases[phaseIndex].description;
}

function getRecoveryExercise(category, phaseIndex, exIndex) {
    const tr = getRecoveryTranslation(category.id);
    const ex = category.phases[phaseIndex].exercises[exIndex];
    if (!tr) return ex;
    const trEx = tr.phases[phaseIndex].exercises[exIndex];
    return {
        name: trEx.name,
        duration: trEx.duration,
        description: trEx.description
    };
}