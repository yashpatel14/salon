import { Router } from "express";
import { registerStep1, registerStep2, registerStep3, registerStep4, registerStep5, registerStep6, registerStep7 } from "../controllers/user.controllers.js";

const router = Router();

router.post('/step1',registerStep1);
router.post('/step2',registerStep2);
router.post('/step3',registerStep3);
router.post('/step4',registerStep4);
router.post('/step5',registerStep5);
router.post('/step6',registerStep6);
router.post('/step7',registerStep7);

export default router