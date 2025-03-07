const dbConn = require("../data-access/dbConnection");
const { ExamTerm } = require("../models");

const addOrUpdateExamTerm = async (req, res) => {
    const { exam_term } = req.body
    const isTermExist = await getExamTerm()

    console.log(isTermExist)

    if (isTermExist) {
        return await res.status(200).json(updateTerm(exam_term, isTermExist.id))
    } else {
        return await res.status(200).json(addTerm(exam_term))
    }

}

const addTerm = async (term) => {
    const createData = await dbConn.transaction();
    try {
        const addTerm = await ExamTerm.create(
            {
                exam_term: term,
                transaction: createData
            }
        )

        await createData.commit();

        return addTerm
    } catch (error) {
        console.log(error);
        await createPayment.rollback();
        return error
    }
}

const updateTerm = async (term, id) => {
    try {
        await ExamTerm.update(
            {
                exam_term: term,
            },
            {
                where: {
                    id: id,
                },
            }
        )
            .then((term) => {
                return term
            })
            .catch((error) => {
                console.error(error);
            });
    } catch (error) {
        res.json(error);
    }
}

const getExamTerm = async () => {
    try {
        const getTerm = await ExamTerm.findOne({ attributes: ["id", "exam_term"] });
        return getTerm
    } catch (error) {
        console.log(error)
        return error
    }
}

const fetchCurrentTerm = async (req, res) => {
    try {
        const term = await getExamTerm();
        res.status(200).json(term)
    } catch (error) {
        res.status(500).json(error)
    }
}


module.exports = {
    addOrUpdateExamTerm,
    fetchCurrentTerm,
    getExamTerm
}