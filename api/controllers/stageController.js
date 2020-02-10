var mongoose = require('mongoose')
Stages = mongoose.model('Stages');

exports.list_all_stages = function(req, res) {
    Stages.find({}, function(err, stages) {
        if(err) {
            res.send(err);
        } else {
            res.json(stages);
        }
    });
}

exports.create_a_stage = function(req, res) {
    var new_stage = new Stages(req.body);
    new_stage.save(function(err) {
        if(err) {
            res.send(err);
        } else {
            res.sendStatus(201);
        }
    });
}

exports.read_a_stage = function(req, res) {
    Stages.findById(req.params.stageId, function(err, stage) {
        if(err) {
            res.send(err);
        } else {
            res.json(stage);
        }
    })
}

exports.edit_a_stage = function(req, res) {
    Stages.findOneAndUpdate({_id: req.params.stageId}, req.body, null, function(err, stage) {
        if(err) {
            res.send(err);
        } else {
            res.json(stage);
        }
    })
}

exports.delete_a_stage = function(req, res) {
    Stages.remove({_id: req.params.stageId}, function(err) {
        if(err) {
            res.send(err);
        } else {
            res.json({message: 'Stage successfully deleted'});
        }
    })
}
