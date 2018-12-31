@extends('layouts.app')

@section('content')

<div class="edit-profile-wrapper">
    <div class="edit-profile-form">

        {!! Form::open(['action' => ['DashboardController@update', $user->id], 'method' => 'POST']) !!}

            <div class="form-section">
                {{ Form::label('username') }}
                {{ Form::text('username', $user->username) }}
            </div>

            <div class="form-section">
                {{ Form::label('email') }}
                {{ Form::text('email', $user->email) }}
            </div>

            <div class="form-section">
                {{ Form::label('Current Password') }}
                {{ Form::password('current_password') }}
            </div>

            <div class="form-section">
                {{ Form::label('New Password') }}
                {{ Form::password('new_password') }}
            </div>

            <div class="form-section">
                {{ Form::label('Confirm Password') }}
                {{ Form::password('confirm_password') }}
            </div>

            <div class="form-section">
                {{ Form::submit('Update') }}
            </div>

            {{ Form::hidden('_method', 'PUT') }}

        {!! Form::close() !!}

    </div>
</div>

@endsection