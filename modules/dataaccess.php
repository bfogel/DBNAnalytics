<?php

function dbn_GetConnection(){

	$servername = "localhost";
	$username = "uydxiqcqqwaho";
	$password = "gh^511`31^3r";
	$dbname = "dbo4lunx2qm2nn";
	
	// Create connection
	$conn = new mysqli($servername, $username, $password, $dbname);
	
	// Check connection
	if ($conn->connect_error) {
	    die("Connection failed: " . $conn->connect_error);
	} 

	return $conn;

}

function GetResultsetAsJSON($sql, $parameters = null)
{
    $rs = new ResultSet($sql, $parameters);
    return $rs->ToJSON();
}

class ResultSet
{
    public $success = false;
    public $fields = [];
    public $data = [];
    public $message = null;

    function __construct($sql = null, $parameters = null)
    {
        if ($sql != null) $this->Retrieve($sql, $parameters);
    }

    public function GetFieldIndex($fieldname)
    {
        $i = 0;
        foreach ($this->fields as $value) {
            if ($value["name"] == $fieldname) return $i;
            $i++;
        }
        return -1;
    }

    public function ToJSON()
    {
        $ret = [];
        $ret["success"] = $this->success;
        $ret["message"] = $this->message;
        $ret["content"] = ["fields" => $this->fields, "data" => $this->data];
        return $ret;
    }

    private function Retrieve($sql, $parameters = null)
    {
        $this->success = false;

        $conn = dbn_GetConnection();
        $statement = $conn->prepare($sql);

        if ($statement === false) {
            $this->message = $conn->error;
            return;
        }

        if ($parameters != null) {
            $types = "";
            foreach ($parameters as $value) {
                switch (gettype($value)) {
                    case 'string':
                        $types .= "s";
                        break;
                    case 'integer':
                        $types .= "i";
                        break;
                    case 'double':
                        $types .= "d";
                        break;
                    default:
                        $this["message"] = "Unsupported parameter type: " . gettype($value);
                        return;
                }
            }

            if (($statement->bind_param($types, ...$parameters)) === false) {
                $this->message = $conn->error;
                return;
            }
        }

        if (($statement->execute()) === false) {
            $this->message = $conn->error;
            return;
        }

        $result = $statement->get_result();

        if ($result === false) {
            $this->message = $conn->error;
            return;
        }

        $fields = [];
        foreach ($result->fetch_fields() as &$field) {
            $ff = [];
            $ff["name"] = $field->name;
            array_push($fields, $ff);
        }
        unset($field);

        $this->fields = $fields;

        $data = [];
        while ($row = $result->fetch_assoc()) {
            array_push($data, array_values($row));
        }

        $this->data = $data;
        $this->success = true;
    }
}

?>