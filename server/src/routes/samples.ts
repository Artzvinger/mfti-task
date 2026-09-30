import { Router } from 'express';
import { requireAuth } from '../middleware/authCheck';

const router = Router();

router.get('/', requireAuth, async (_req, res) => {
    return res.json({
        message: 'Samples API works',
    });
});

export default router;