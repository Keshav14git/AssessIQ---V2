import { useEffect, useRef, useState } from "react";
import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
import toast from "react-hot-toast";

// Constants for violation logic - RELAXED FOR TESTING
const CHECK_INTERVAL_MS = 100; // Check 10 times per second

interface UseFaceMonitorProps {
    stream: MediaStream | null;
    onViolation: (type: "looking_away" | "multiple_faces" | "no_face") => void;
}

export function useFaceMonitor({ stream, onViolation }: UseFaceMonitorProps) {
    const [trustScore, setTrustScore] = useState(100);
    const [status, setStatus] = useState<"initializing" | "ready" | "error" | "no-stream">("initializing");

    // DEBUG STATE
    const [debugInfo, setDebugInfo] = useState({ faces: 0, ratio: 0 });

    const videoRef = useRef<HTMLVideoElement | null>(null);
    const faceLandmarkerRef = useRef<FaceLandmarker | null>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // Counters for sustained violations
    const violationCounters = useRef({
        lookingAway: 0,
        noFace: 0,
        multipleFaces: 0,
    });

    // STALE CLOSURE FIX: Keep latest reference to onViolation
    const onViolationRef = useRef(onViolation);
    useEffect(() => {
        onViolationRef.current = onViolation;
    }, [onViolation]);

    // Initialize MediaPipe FaceLandmarker
    useEffect(() => {
        const initMediaPipe = async () => {
            try {
                setStatus("initializing");
                console.log("Initializing MediaPipe FaceLandmarker...");

                const filesetResolver = await FilesetResolver.forVisionTasks(
                    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
                );

                faceLandmarkerRef.current = await FaceLandmarker.createFromOptions(filesetResolver, {
                    baseOptions: {
                        modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
                        delegate: "GPU",
                    },
                    outputFaceBlendshapes: true,
                    runningMode: "VIDEO",
                    numFaces: 2,
                    minFaceDetectionConfidence: 0.5,
                    minFacePresenceConfidence: 0.5,
                    minTrackingConfidence: 0.5,
                });

                setStatus("ready");
                console.log("MediaPipe initialized successfully");
            } catch (error) {
                console.error("Failed to initialize MediaPipe FaceLandmarker:", error);
                setStatus("error");
            }
        };

        initMediaPipe();

        return () => {
            if (faceLandmarkerRef.current) {
                faceLandmarkerRef.current.close();
            }
        };
    }, []);

    // Helper to handle violations safely
    const handleViolation = (type: string, message: string) => {
        toast.error(message, { id: "proctor-warning", duration: 4000 });
        setTrustScore(prev => Math.max(0, prev - 5));

        // Use the REF to call the latest callback closure
        if (onViolationRef.current) {
            onViolationRef.current(type as any);
        }
    };

    // Process Video Stream
    useEffect(() => {
        // If no stream is provided, update status
        if (!stream) {
            setStatus("no-stream");
            return;
        }

        if (faceLandmarkerRef.current) {
            setStatus("ready");
        }

        // Create a hidden video element to process the stream
        const video = document.createElement("video");
        video.srcObject = stream;
        video.autoplay = true;
        video.muted = true;
        video.playsInline = true;

        // CRITICAL: Explicitly play the video
        video.play().catch(e => console.error("Video play failed", e));

        videoRef.current = video;

        const detectFrame = async () => {
            if (!videoRef.current || videoRef.current.paused || videoRef.current.ended || !faceLandmarkerRef.current) return;

            // Wait for video to be ready
            if (videoRef.current.readyState < 2) return;

            const startTimeMs = performance.now();
            const results = faceLandmarkerRef.current.detectForVideo(videoRef.current, startTimeMs);

            if (!results) return;

            const faces = results.faceLandmarks;
            const faceCount = faces.length;

            let currentRatio = 0;

            // 1. NO FACE DETECTED
            if (faceCount === 0) {
                violationCounters.current.noFace++;
                if (violationCounters.current.noFace > 20) { // ~2 seconds
                    handleViolation("no_face", "No face detected. Please stay in frame.");
                    violationCounters.current.noFace = 0;
                }
            } else {
                violationCounters.current.noFace = 0;
            }

            // 2. MULTIPLE FACES DETECTED
            if (faceCount > 1) {
                violationCounters.current.multipleFaces++;
                if (violationCounters.current.multipleFaces > 20) { // ~2 seconds
                    handleViolation("multiple_faces", "Multiple faces detected.");
                    violationCounters.current.multipleFaces = 0;
                }
            } else {
                violationCounters.current.multipleFaces = 0;
            }

            // 3. LOOKING AWAY
            if (faceCount === 1) {
                const landmarks = faces[0];
                const noseX = landmarks[1].x;
                const leftEdgeX = landmarks[234].x;
                const rightEdgeX = landmarks[454].x;

                const distToLeft = Math.abs(noseX - leftEdgeX);
                const distToRight = Math.abs(noseX - rightEdgeX);
                currentRatio = distToLeft / (distToRight + 0.0001);

                // Thresholds
                const isLookingLeft = currentRatio > 2.5;
                const isLookingRight = currentRatio < 0.4;

                if (isLookingLeft || isLookingRight) {
                    violationCounters.current.lookingAway++;
                    if (violationCounters.current.lookingAway > 15) { // ~1.5 seconds
                        handleViolation("looking_away", "Please focus on the screen.");
                        violationCounters.current.lookingAway = 0;
                    }
                } else {
                    violationCounters.current.lookingAway = Math.max(0, violationCounters.current.lookingAway - 1);
                }
            }

            // Update Debug Info
            setDebugInfo({ faces: faceCount, ratio: parseFloat(currentRatio.toFixed(2)) });
        };

        intervalRef.current = setInterval(detectFrame, CHECK_INTERVAL_MS);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [stream, status]);

    return { trustScore, status, debugInfo };
}
