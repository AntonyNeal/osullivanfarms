const db = require('../db');

// Get all active mobs with KPIs
exports.getAllMobs = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM mob_kpi_summary ORDER BY last_updated DESC');

    res.json({
      success: true,
      data: result.rows,
      count: result.rows.length,
    });
  } catch (error) {
    console.error('Error fetching mobs:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch mobs',
      message: error.message,
    });
  }
};

// Get single mob by ID
exports.getMobById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query('SELECT * FROM mobs WHERE mob_id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Mob not found',
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error fetching mob:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch mob',
      message: error.message,
    });
  }
};

// Get mob history
exports.getMobHistory = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      `SELECT * FROM mob_history 
       WHERE mob_id = $1 
       ORDER BY changed_at DESC`,
      [id]
    );

    res.json({
      success: true,
      data: result.rows,
      count: result.rows.length,
    });
  } catch (error) {
    console.error('Error fetching mob history:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch mob history',
      message: error.message,
    });
  }
};

// Create new mob
exports.createMob = async (req, res) => {
  try {
    const {
      mob_name,
      breed_name,
      status_name,
      zone_name,
      team_name,
      current_stage,
      current_location,
      ewes_joined,
      rams_in,
      joining_date,
    } = req.body;

    const result = await db.query(
      `INSERT INTO mobs (
        mob_name, breed_name, status_name, zone_name, team_name,
        current_stage, current_location, ewes_joined, rams_in, joining_date
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *`,
      [
        mob_name,
        breed_name,
        status_name,
        zone_name,
        team_name,
        current_stage || 'Pre-Joining',
        current_location,
        ewes_joined,
        rams_in,
        joining_date,
      ]
    );

    res.status(201).json({
      success: true,
      data: result.rows[0],
      message: 'Mob created successfully',
    });
  } catch (error) {
    console.error('Error creating mob:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create mob',
      message: error.message,
    });
  }
};

// Update mob data
exports.updateMob = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Build dynamic UPDATE query
    const fields = Object.keys(updates);
    const values = Object.values(updates);

    if (fields.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No fields to update',
      });
    }

    const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ');

    const query = `
      UPDATE mobs 
      SET ${setClause}
      WHERE mob_id = $1
      RETURNING *
    `;

    const result = await db.query(query, [id, ...values]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Mob not found',
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
      message: 'Mob updated successfully',
    });
  } catch (error) {
    console.error('Error updating mob:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update mob',
      message: error.message,
    });
  }
};

// Get farm statistics
exports.getFarmStatistics = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM farm_statistics');

    res.json({
      success: true,
      data: result.rows[0] || {},
    });
  } catch (error) {
    console.error('Error fetching farm statistics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch farm statistics',
      message: error.message,
    });
  }
};

// Record breeding event
exports.recordBreedingEvent = async (req, res) => {
  try {
    const { mob_id, event_type, event_date, event_time, event_data, notes, recorded_by } = req.body;

    const result = await db.query(
      `INSERT INTO breeding_events (
        mob_id, event_type, event_date, event_time, 
        event_data, notes, recorded_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *`,
      [
        mob_id,
        event_type,
        event_date,
        event_time,
        event_data ? JSON.stringify(event_data) : null,
        notes,
        recorded_by,
      ]
    );

    res.status(201).json({
      success: true,
      data: result.rows[0],
      message: 'Breeding event recorded successfully',
    });
  } catch (error) {
    console.error('Error recording breeding event:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to record breeding event',
      message: error.message,
    });
  }
};
