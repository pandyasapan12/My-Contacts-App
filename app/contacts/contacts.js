'use strict';

angular.module('myContacts.contacts', ['ngRoute', 'firebase'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/contacts', {
    templateUrl: 'contacts/contacts.html',
    controller: 'contactsController'
  });
}])

//Contact controller
.controller('contactsController', ['$scope', '$firebaseArray',function($scope, $firebaseArray) {

	//Init Firebase
	var ref = new Firebase('https://newmycontactapp.firebaseio.com/contacts');

	//Get contacts
	$scope.contacts = $firebaseArray(ref);

	//Show New Contact Form
	$scope.showAddForm = function(){
		$scope.addFormShow = true;
	}

	//Show Edit Contact Form
	$scope.showEditForm = function(contact){
		$scope.editFormShow = true;

		$scope.id = contact.$id;
		$scope.name = contact.name;
		$scope.email = contact.email;
		$scope.company = contact.company;
		$scope.work_phone = contact.phones[0].work;
		$scope.mobile_phone = contact.phones[0].mobile;
		$scope.home_phone = contact.phones[0].home;
		$scope.street_address = contact.address[0].street;
		$scope.city = contact.address[0].city;
		$scope.state = contact.address[0].state;
		$scope.zipcode = contact.address[0].zipcode;
	}


	//Hide New Contact Form
	$scope.hideForm = function(){
		$scope.addFormShow = false;
		$scope.contactShow = false;
		$scope.editFormShow = false;
	}

	//Submit New Contact Form
	$scope.addFormSubmit = function(){
		
		//Assigning The Input Values
		if($scope.name){ var name = $scope.name } else { var name = null; }
		if($scope.email){ var email = $scope.email } else { var email = null; }
		if($scope.company){ var company = $scope.company } else { var company = null; }
		if($scope.work_phone){ var work_phone = $scope.work_phone } else { var work_phone = null; }
		if($scope.mobile_phone){ var mobile_phone = $scope.mobile_phone } else { var mobile_phone = null; }
		if($scope.home_phone){ var home_phone = $scope.home_phone } else { var home_phone = null; }
		if($scope.street_address){ var street_address = $scope.street_address } else { var street_address = null; }
		if($scope.city){ var city = $scope.city } else { var city = null; }
		if($scope.state){ var state = $scope.state } else { var state = null; }
		if($scope.zipcode){ var zipcode = $scope.zipcode } else { var zipcode = null; }
	
		//Buliding an Object
		$scope.contacts.$add({
			name: name,
			email: email,
			company: company,
			phones:[
				{
					work: work_phone,
					mobile: mobile_phone,
					home: home_phone
				}
			],
			address:[
				{
					street: street_address,
					city: city,
					state: state,
					zipcode: zipcode
				}
			]
		}).then(function(ref){
			var id = ref.key();
			console.log('Added contact with id: '+id);

			//Clear The New Contact Form
			clearFields();

			//hide forms
			$scope.addFormShow = false;


			//Send Message
			$scope.msg = "Contact Added";
		});
	}


	//Editing Contact Details
	$scope.editFormSubmit = function(){

		//Get ID
		var id = $scope.id;

		//Get Record
		var record = $scope.contacts.$getRecord(id);

		//Assign Values
		record.name = $scope.name;
		record.email = $scope.email;
		record.company = $scope.company;
		record.phones[0].work = $scope.work_phone;
		record.phones[0].mobile = $scope.mobile_phone;
		record.phones[0].home = $scope.home_phone;
		record.address[0].street = $scope.street_address;
		record.address[0].city = $scope.city;
		record.address[0].state = $scope.state;
		record.address[0].zipcode = $scope.zipcode;

		//Save Contact
		$scope.contacts.$save(record).then(function(ref){
			console.log(ref.key);
		});

		clearFields();

		//Hide Edit Form
		$scope.editFormShow = false;

		$scope.msg = "Contact Updated";
	}

	//Showing Contact Details
	$scope.showContact = function(contact){

		$scope.name = contact.name;
		$scope.email = contact.email;
		$scope.company = contact.company;
		$scope.work_phone = contact.phones[0].work;
		$scope.mobile_phone = contact.phones[0].mobile;
		$scope.home_phone = contact.phones[0].home;
		$scope.street_address = contact.address[0].street;
		$scope.city = contact.address[0].city;
		$scope.state = contact.address[0].state;
		$scope.zipcode = contact.address[0].zipcode;

		$scope.contactShow = true;
		
	}

	//Removing Contact
	$scope.removeContact = function(contact){

		$scope.contacts.$remove(contact);

		$scope.msg = "Contact Removed";
	}

	//Clearing Form Fields
	function clearFields(){
		$scope.name = '';
		$scope.email = '';
		$scope.company = '';
		$scope.work_phone = '';
		$scope.mobile_phone = '';
		$scope.home_phone = '';
		$scope.street_address = '';
		$scope.city = '';
		$scope.state = '';
		$scope.zipcode = '';
	}
}]);